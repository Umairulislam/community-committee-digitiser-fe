import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { runInThisContext } from 'node:vm';
import { configureStore } from '@reduxjs/toolkit';
import ts from 'typescript';

// Load the API modules with the existing TypeScript dependency and @/ alias.
const root = fileURLToPath(new URL('../', import.meta.url));
const modules = new Map();
function loadModule(filename) {
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module);
  const externalRequire = createRequire(filename);
  const localRequire = (id) => {
    if (id.startsWith('@/')) return loadModule(path.join(root, 'src', `${id.slice(2)}.ts`));
    if (id.startsWith('.')) return loadModule(path.resolve(path.dirname(filename), `${id}.ts`));
    return externalRequire(id);
  };
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  runInThisContext(`(function(require, module, exports) {${outputText}\n})`, { filename })(
    localRequire, module, module.exports,
  );
  return module.exports;
}

const { baseApi } = loadModule(path.join(root, 'src/api/baseApi.ts'));
const { adminPayoutsApi: api } = loadModule(path.join(root, 'src/features/admin/payouts/api/adminPayoutsApi.ts'));
const { committeesApi } = loadModule(path.join(root, 'src/features/committees/api/committeesApi.ts'));
const { payoutTransitions, matchesLottery, payoutError } = loadModule(path.join(root, 'src/features/admin/payouts/utils/statusFlow.ts'));
const { payoutReferenceSchema } = loadModule(path.join(root, 'src/features/admin/payouts/schemas/payoutSchema.ts'));
const params = { committeeId: 'committee', cycleId: 'cycle' };
const payout = { id: 'payout', cycleId: 'cycle', memberId: 'winner', amount: '15000.00', status: 'PENDING', cycle: { id: 'cycle' }, member: { id: 'winner' } };

test('only documented transitions are offered; completed and unknown states fail closed', () => {
  const expected = { PENDING: ['PROCESSING'], PROCESSING: ['COMPLETED', 'FAILED'], FAILED: ['PROCESSING'], COMPLETED: [] };
  for (const [from, targets] of Object.entries(expected)) assert.deepEqual(payoutTransitions(from), targets);
  assert.deepEqual(payoutTransitions('UNKNOWN'), []);
});

test('payout must match the persisted winner and selected cycle', () => {
  const lottery = { cycleId: 'cycle', winnerMemberId: 'winner' };
  assert.equal(matchesLottery(payout, lottery, 'cycle'), true);
  assert.equal(matchesLottery(payout, { ...lottery, winnerMemberId: 'other' }, 'cycle'), false);
  assert.equal(matchesLottery(payout, { ...lottery, cycleId: 'other' }, 'cycle'), false);
  assert.equal(matchesLottery({ ...payout, cycle: { id: 'other' } }, lottery, 'cycle'), false);
  assert.equal(matchesLottery({ ...payout, member: undefined }, lottery, 'cycle'), false);
  assert.equal(matchesLottery(payout, lottery, 'other'), false);
});

test('reference is optional and limited to 255 characters; errors do not expose server internals', () => {
  assert.equal(payoutReferenceSchema.safeParse({ reference: '' }).success, true);
  assert.equal(payoutReferenceSchema.safeParse({ reference: 'x'.repeat(255) }).success, true);
  assert.equal(payoutReferenceSchema.safeParse({ reference: 'x'.repeat(256) }).success, false);
  assert.equal(payoutError({ status: 500, data: { message: 'secret SQL data' } }).includes('secret'), false);
});

function setup(t, handler) {
  const store = configureStore({ reducer: { api: baseApi.reducer }, middleware: getDefault => getDefault().concat(baseApi.middleware) });
  t.after(() => store.dispatch(baseApi.util.resetApiState()));
  t.mock.method(globalThis, 'fetch', handler);
  return store;
}

test('create sends no winner or amount; PATCH sends only documented status and reference', async t => {
  const requests = [];
  const store = setup(t, async request => {
    requests.push({ url: new URL(request.url).pathname, method: request.method, body: await request.text() });
    return Response.json({ ...payout, status: request.method === 'PATCH' ? 'COMPLETED' : 'PENDING' });
  });
  await store.dispatch(api.endpoints.createAdminPayout.initiate(params)).unwrap();
  await store.dispatch(api.endpoints.updateAdminPayoutStatus.initiate({ ...params, id: 'payout', status: 'COMPLETED', reference: 'BANK-123' })).unwrap();
  assert.deepEqual(requests, [
    { url: '/committees/committee/cycles/cycle/payout', method: 'POST', body: '' },
    { url: '/committees/committee/cycles/cycle/payout/payout/status', method: 'PATCH', body: JSON.stringify({ status: 'COMPLETED', reference: 'BANK-123' }) },
  ]);
});

test('status filter and pagination use the committee list; detail reads use singular payout', async t => {
  const urls = [];
  const store = setup(t, async request => { urls.push(new URL(request.url)); return Response.json(payout); });
  await store.dispatch(committeesApi.endpoints.getPayouts.initiate({ committeeId: 'committee', status: 'COMPLETED', page: 2, limit: 10 })).unwrap();
  await store.dispatch(api.endpoints.getAdminCyclePayout.initiate(params)).unwrap();
  assert.equal(urls[0].pathname, '/committees/committee/payouts');
  assert.equal(urls[0].searchParams.get('status'), 'COMPLETED');
  assert.equal(urls[0].searchParams.get('page'), '2');
  assert.equal(urls[0].searchParams.get('limit'), '10');
  assert.equal(urls[1].pathname, '/committees/committee/cycles/cycle/payout');
});

test('failed updates never optimistically complete a payout and trigger authoritative refresh', async t => {
  let reads = 0;
  const store = setup(t, async request => {
    if (request.method === 'PATCH') return Response.json({ message: 'Invalid transition' }, { status: 400 });
    reads++;
    return Response.json(payout);
  });
  await store.dispatch(api.endpoints.getAdminCyclePayout.initiate(params)).unwrap();
  const result = await store.dispatch(api.endpoints.updateAdminPayoutStatus.initiate({ ...params, id: 'payout', status: 'COMPLETED' }));
  assert.equal(result.error.status, 400);
  await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
  assert.equal(api.endpoints.getAdminCyclePayout.select(params)(store.getState()).data.status, 'PENDING');
  assert.ok(reads >= 2);
});

test('successful updates refresh subscribed payout detail and list from backend', async t => {
  let status = 'PROCESSING';
  const store = setup(t, async request => {
    if (request.method === 'PATCH') status = 'COMPLETED';
    const record = { ...payout, status, paidAt: status === 'COMPLETED' ? '2026-09-10T10:00:00Z' : null };
    return Response.json(new URL(request.url).pathname.endsWith('/payouts') ? { data: [record], total: 1, page: 1, limit: 10 } : record);
  });
  const listArgs = { committeeId: 'committee', page: 1, limit: 10 };
  await store.dispatch(api.endpoints.getAdminCyclePayout.initiate(params)).unwrap();
  await store.dispatch(committeesApi.endpoints.getPayouts.initiate(listArgs)).unwrap();
  await store.dispatch(api.endpoints.updateAdminPayoutStatus.initiate({ ...params, id: 'payout', status: 'COMPLETED' })).unwrap();
  await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
  assert.equal(api.endpoints.getAdminCyclePayout.select(params)(store.getState()).data.status, 'COMPLETED');
  assert.equal(committeesApi.endpoints.getPayouts.select(listArgs)(store.getState()).data.data[0].paidAt, '2026-09-10T10:00:00Z');
});
