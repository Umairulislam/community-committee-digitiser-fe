import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInThisContext } from 'node:vm';
import { configureStore } from '@reduxjs/toolkit';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Load the API modules with the existing TypeScript dependency and @/ alias.
const root = fileURLToPath(new URL('../', import.meta.url));
const modules = new Map();
function loadModule(filename) {
  if (!existsSync(filename)) {
    const stem = filename.slice(0, -3);
    filename = existsSync(stem + '/index.ts') ? stem + '/index.ts' : stem + '.tsx';
  }
  if (modules.has(filename)) return modules.get(filename).exports;
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule);
  const externalRequire = createRequire(filename);
  const localRequire = (id) => {
    if (id.startsWith('@/')) return loadModule(path.join(root, 'src', `${id.slice(2)}.ts`));
    if (id.startsWith('.')) return loadModule(path.resolve(path.dirname(filename), `${id}.ts`));
    return externalRequire(id);
  };
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  });
  runInThisContext(`(function(require, module, exports) {${outputText}\n})`, { filename })(
    localRequire, loadedModule, loadedModule.exports,
  );
  return loadedModule.exports;
}

const { baseApi } = loadModule(path.join(root, 'src/api/baseApi.ts'));
const { adminReportsApi: reports } = loadModule(path.join(root, 'src/features/admin/reports/api/adminReportsApi.ts'));
const { committeesApi } = loadModule(path.join(root, 'src/features/committees/api/committeesApi.ts'));
const { adminContributionsApi: notifications } = loadModule(path.join(root, 'src/features/admin/contributions/api/adminContributionsApi.ts'));
const { notificationsApi: inbox } = loadModule(path.join(root, 'src/features/notifications/api/notificationsApi.ts'));
const { notificationSchema, NOTIFICATION_TYPES } = loadModule(path.join(root, 'src/features/admin/notifications/schemas/notificationSchema.ts'));
const { reportRequest, REPORTS } = loadModule(path.join(root, 'src/features/admin/reports/utils/reportRequest.ts'));

function setup(t, handler) {
  const store = configureStore({ reducer: { api: baseApi.reducer }, middleware: getDefault => getDefault().concat(baseApi.middleware) });
  t.after(() => store.dispatch(baseApi.util.resetApiState()));
  t.mock.method(globalThis, 'fetch', handler);
  return store;
}

test('notification validation enforces documented limits, trims input and accepts all 11 types', () => {
  assert.equal(NOTIFICATION_TYPES.length, 11);
  for (const type of NOTIFICATION_TYPES) assert.equal(notificationSchema.safeParse({ type, title: 'Title', message: 'Message' }).success, true);
  assert.deepEqual(notificationSchema.parse({ type: 'GENERAL', title: ' Title ', message: ' Message ', recipients: ['unsupported'] }), { type: 'GENERAL', title: 'Title', message: 'Message' });
  for (const input of [
    { type: 'UNKNOWN', title: 'Title', message: 'Message' },
    { type: 'GENERAL', title: ' ', message: 'Message' },
    { type: 'GENERAL', title: 'Title', message: ' ' },
    { type: 'GENERAL', title: 'x'.repeat(256), message: 'Message' },
    { type: 'GENERAL', title: 'Title', message: 'x'.repeat(2001) },
  ]) assert.equal(notificationSchema.safeParse(input).success, false);
  assert.equal(notificationSchema.safeParse({ type: 'GENERAL', title: 'x'.repeat(255), message: 'x'.repeat(2000) }).success, true);
});

test('broadcast sends only the documented message body and refreshes inbox without modifying reports', async t => {
  const requests = [];
  const store = setup(t, async request => {
    requests.push({ method: request.method, path: new URL(request.url).pathname, body: await request.text() });
    assert.equal(request.credentials, 'include');
    return Response.json(request.method === 'POST' ? { sent: 7 } : { data: [], total: 0 });
  });
  await store.dispatch(inbox.endpoints.getNotifications.initiate({ page: 1, limit: 20 })).unwrap();
  await store.dispatch(reports.endpoints.getContributionReport.initiate({ committeeId: 'committee' })).unwrap();
  const result = await store.dispatch(notifications.endpoints.sendCommitteeNotification.initiate({
    committeeId: 'committee', ...notificationSchema.parse({ type: 'GENERAL', title: 'Title', message: 'Message' }),
  })).unwrap();
  await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
  assert.equal(result.sent, 7);
  assert.deepEqual(requests.filter(request => request.method !== 'GET'), [{
    method: 'POST', path: '/committees/committee/notifications', body: JSON.stringify({ type: 'GENERAL', title: 'Title', message: 'Message' }),
  }]);
  assert.equal(requests.filter(request => request.path === '/notifications').length, 2);
  assert.equal(requests.filter(request => request.path.endsWith('/reports/contributions')).length, 1);
});

test('failed send returns an error with no successful recipient count', async t => {
  const store = setup(t, async () => Response.json({ message: 'Not creator' }, { status: 403 }));
  const result = await store.dispatch(notifications.endpoints.sendCommitteeNotification.initiate({ committeeId: 'other', title: 'Title', message: 'Message' }));
  assert.equal(result.error.status, 403);
  assert.equal(result.data, undefined);
});

test('report filter scope is identical for JSON and CSV and omits unsupported dates', () => {
  for (const report of Object.keys(REPORTS)) {
    const args = { committeeId: 'committee', report, cycleId: 'cycle', status: 'OVERDUE', page: 3, limit: 50, dateFrom: '2026-01-01' };
    const json = reportRequest(args);
    const csv = reportRequest(args, true);
    assert.equal(csv.url, json.url + '/csv');
    assert.deepEqual(csv.params, json.params);
    assert.deepEqual(json.params, report === 'summary' ? undefined : report === 'outstanding' ? { cycleId: 'cycle', status: 'OVERDUE', page: 3, limit: 50 } : { cycleId: 'cycle' });
  }
});

test('all JSON reports use documented GET paths and preserve backend values', async t => {
  const requests = [];
  const backend = { data: [{ cycleId: 'cycle', totalExpected: 12345, totalCollected: 8765, collectionRatePercent: 37 }], total: 51, page: 2, limit: 50 };
  const store = setup(t, async request => { requests.push(new URL(request.url)); assert.equal(request.method, 'GET'); return Response.json(backend); });
  const endpoints = [
    ['getContributionReport', 'contributions'], ['getOutstandingReport', 'outstanding'], ['getCycleReport', 'cycles'],
    ['getLotteryPayoutReport', 'lottery-payouts'], ['getMemberReport', 'members'],
  ];
  for (const [name, report] of endpoints) {
    const result = await store.dispatch(reports.endpoints[name].initiate({ committeeId: 'committee', cycleId: 'cycle', status: 'OVERDUE', page: 2, limit: 50 })).unwrap();
    assert.deepEqual(result, backend);
    const request = requests.at(-1);
    assert.equal(request.pathname, '/committees/committee/reports/' + report);
    assert.deepEqual(Object.fromEntries(request.searchParams), report === 'outstanding' ? { cycleId: 'cycle', status: 'OVERDUE', page: '2', limit: '50' } : { cycleId: 'cycle' });
  }
  await store.dispatch(committeesApi.endpoints.getReportSummary.initiate({ committeeId: 'committee' })).unwrap();
  assert.equal(requests.at(-1).pathname, '/committees/committee/reports/summary');
  assert.equal(requests.at(-1).search, '');
});

test('all CSV endpoints return the exact backend CSV with cookies and active filters', async t => {
  const csv = 'name,amount\r\n"Member, One",123.45\r\n';
  const store = setup(t, async request => {
    assert.equal(request.method, 'GET');
    assert.equal(request.credentials, 'include');
    assert.ok(new URL(request.url).pathname.endsWith('/csv'));
    return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
  });
  for (const report of Object.keys(REPORTS)) {
    const result = await store.dispatch(reports.endpoints.getReportCsv.initiate({ committeeId: 'committee', report, cycleId: 'cycle' })).unwrap();
    assert.equal(result, csv);
  }
});

test('CSV errors and unexpected success formats cannot become downloaded reports', async t => {
  const store = setup(t, async request => new URL(request.url).pathname.includes('/denied/')
    ? Response.json({ message: 'Forbidden' }, { status: 403 })
    : new Response('<html>Login</html>', { headers: { 'Content-Type': 'text/html' } }));
  const denied = await store.dispatch(reports.endpoints.getReportCsv.initiate({ committeeId: 'denied', report: 'summary' }));
  assert.equal(denied.error.status, 403);
  assert.equal(denied.data, undefined);
  const html = await store.dispatch(reports.endpoints.getReportCsv.initiate({ committeeId: 'committee', report: 'summary' }));
  assert.equal(html.error.status, 'PARSING_ERROR');
  assert.equal(html.data, undefined);
});

test('report table renders backend percentages, zero, null and empty states without calculating totals', () => {
  const { ReportTable } = loadModule(path.join(root, 'src/features/admin/reports/components/ReportTable.tsx'));
  const html = renderToStaticMarkup(createElement(ReportTable, {
    rows: [{ cycleId: 'cycle', collectionRatePercent: 37, totalContributions: 0, startDate: null }],
    columns: ['collectionRatePercent', 'totalContributions', 'startDate'], rowKey: 'cycleId', label: 'Cycle report',
  }));
  assert.match(html, /37%/);
  assert.match(html, />0</);
  assert.match(html, /Not available/);
  const empty = renderToStaticMarkup(createElement(ReportTable, { rows: [], columns: [], rowKey: 'id', label: 'Empty report' }));
  assert.match(empty, /No report records/);
});
