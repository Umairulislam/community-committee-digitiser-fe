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
const { adminAuditApi: api } = loadModule(path.join(root, 'src/features/admin/audit/api/adminAuditApi.ts'));
const { timelineApi } = loadModule(path.join(root, 'src/features/timeline/api/timelineApi.ts'));
const record = { id: 'event', actorId: 'actor', action: 'PAYMENT_VERIFIED', entityType: 'Payment', entityId: 'payment', committeeId: 'committee', cycleId: 'cycle', metadata: { token: 'hidden-secret', amount: 5000 }, createdAt: '2026-09-10T10:00:00Z' };

function setup(t, handler) {
  const store = configureStore({ reducer: { api: baseApi.reducer }, middleware: getDefault => getDefault().concat(baseApi.middleware) });
  t.after(() => store.dispatch(baseApi.util.resetApiState()));
  t.mock.method(globalThis, 'fetch', handler);
  return store;
}

test('audit list uses GET, cookie credentials and only documented filters', async t => {
  const requests = [];
  const store = setup(t, async request => { requests.push(request); return Response.json({ data: [record], total: 1, page: 2, limit: 25 }); });
  const result = await store.dispatch(api.endpoints.getAdminAuditLogs.initiate({
    committeeId: 'committee', action: 'PAYMENT_VERIFIED', cycleId: 'cycle', entityType: 'Payment', page: 2, limit: 25, dateFrom: 'unsupported',
  })).unwrap();
  const url = new URL(requests[0].url);
  assert.equal(url.pathname, '/committees/committee/audit-logs');
  assert.equal(requests[0].method, 'GET');
  assert.equal(requests[0].credentials, 'include');
  assert.deepEqual(Object.fromEntries(url.searchParams), { action: 'PAYMENT_VERIFIED', entityType: 'Payment', cycleId: 'cycle', page: '2', limit: '25' });
  assert.equal(result.data[0].actorId, 'actor');
});

test('timeline preserves backend chronology and sends no filters or pagination', async t => {
  const events = [{ ...record, id: 'earlier', createdAt: '2026-09-01T10:00:00Z' }, record];
  const store = setup(t, async request => {
    assert.equal(new URL(request.url).pathname, '/committees/committee/audit-logs/timeline');
    assert.equal(new URL(request.url).search, '');
    assert.equal(request.method, 'GET');
    return Response.json({ data: events, total: 2 });
  });
  const result = await store.dispatch(timelineApi.endpoints.getAuditTimeline.initiate({ committeeId: 'committee' })).unwrap();
  assert.deepEqual(result.data.map(event => event.id), ['earlier', 'event']);
});

test('different committee/filter queries have separate cache entries; access errors remain errors', async t => {
  const store = setup(t, async request => {
    const url = new URL(request.url);
    if (url.pathname.includes('/denied/')) return Response.json({ message: 'private server information' }, { status: 403 });
    return Response.json({ data: url.searchParams.has('action') ? [] : [record], total: 1, page: 1, limit: 25 });
  });
  const all = { committeeId: 'committee' };
  const filtered = { ...all, action: 'MEMBER_JOINED' };
  await store.dispatch(api.endpoints.getAdminAuditLogs.initiate(all)).unwrap();
  const empty = await store.dispatch(api.endpoints.getAdminAuditLogs.initiate(filtered)).unwrap();
  assert.deepEqual(empty.data, []);
  assert.equal(api.endpoints.getAdminAuditLogs.select(all)(store.getState()).data.data.length, 1);
  const denied = await store.dispatch(api.endpoints.getAdminAuditLogs.initiate({ committeeId: 'denied' }));
  assert.equal(denied.error.status, 403);
  assert.equal(denied.data, undefined);
});

test('Audit invalidation refreshes subscribed history and timeline', async t => {
  let reads = 0;
  const store = setup(t, async () => { reads++; return Response.json({ data: [], total: 0, page: 1, limit: 25 }); });
  await store.dispatch(api.endpoints.getAdminAuditLogs.initiate({ committeeId: 'committee' })).unwrap();
  await store.dispatch(timelineApi.endpoints.getAuditTimeline.initiate({ committeeId: 'committee' })).unwrap();
  store.dispatch(baseApi.util.invalidateTags(['Audit']));
  await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
  assert.equal(reads, 4);
});

test('event display includes who, what, when, committee and cycle without raw metadata', () => {
  const { AuditEvents } = loadModule(path.join(root, 'src/features/admin/audit/components/AuditEvents.tsx'));
  const html = renderToStaticMarkup(createElement(AuditEvents, { events: [record], committeeName: 'Test committee', chronological: true }));
  assert.match(html, /Payment verified/);
  assert.match(html, /Performed by:.*actor/);
  assert.match(html, /Test committee/);
  assert.match(html, /Cycle:.*cycle/);
  assert.match(html, /2026-09-10T10:00:00Z/);
  assert.match(html, /oldest first/);
  assert.doesNotMatch(html, /hidden-secret|5000|Delete|Edit event/);
});

test('unknown actions and unassociated cycles render safely', () => {
  const { AuditEvents } = loadModule(path.join(root, 'src/features/admin/audit/components/AuditEvents.tsx'));
  const html = renderToStaticMarkup(createElement(AuditEvents, {
    events: [{ ...record, action: 'FUTURE_EVENT', cycleId: null }], committeeName: 'Test committee', creator: { id: 'actor', name: 'Admin name' },
  }));
  assert.match(html, /FUTURE_EVENT/);
  assert.match(html, /Not associated with a cycle/);
  assert.match(html, /Admin name/);
});
