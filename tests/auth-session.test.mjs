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
const { authApi } = loadModule(path.join(root, 'src/features/auth/api/authApi.ts'));
const { default: authReducer, setUser } = loadModule(path.join(root, 'src/features/auth/authSlice.ts'));
const { notificationsApi } = loadModule(path.join(root, 'src/features/notifications/api/notificationsApi.ts'));
const admin = { id: 'admin', name: 'Admin', role: 'ADMIN' };
const member = { id: 'member', name: 'Member', role: 'USER' };
const notificationArgs = { page: 1, limit: 10 };

function setup(t) {
  const store = configureStore({
    reducer: { api: baseApi.reducer, auth: authReducer },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  });
  t.after(() => store.dispatch(baseApi.util.resetApiState()));
  let session = admin;
  t.mock.method(globalThis, 'fetch', async (request) => {
    const pathname = new URL(request.url).pathname;
    if (pathname === '/auth/logout') {
      session = null;
      return Response.json({ message: 'Logged out' });
    }
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      const body = await request.json();
      if (body.password === 'wrong') return Response.json({ message: 'Invalid credentials' }, { status: 401 });
      session = member;
      return Response.json({ message: 'Authenticated', user: session });
    }
    if (!session) return Response.json({ message: 'Unauthorised' }, { status: 401 });
    if (pathname === '/auth/me') return Response.json(session);
    if (pathname === '/notifications/unread-count') return Response.json({ count: session === admin ? 9 : 1 });
    if (pathname === '/notifications') {
      return Response.json({ data: [{ id: `${session.id}-notification` }], total: 1, unreadCount: 1 });
    }
    throw new Error(`Unexpected request: ${pathname}`);
  });
  store.dispatch(setUser(admin));
  return store;
}

async function getNotifications(store) {
  return store.dispatch(notificationsApi.endpoints.getNotifications.initiate(notificationArgs)).unwrap();
}

test('admin logout then member login fetches member notifications and unread count', async (t) => {
  const store = setup(t);
  assert.equal((await getNotifications(store)).data[0].id, 'admin-notification');
  await store.dispatch(notificationsApi.endpoints.getUnreadCount.initiate()).unwrap();
  await store.dispatch(authApi.endpoints.getMe.initiate()).unwrap();
  await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  assert.equal(store.getState().auth.user, null);
  assert.deepEqual(store.getState().api.queries, {});
  const result = await store.dispatch(authApi.endpoints.login.initiate({ email: 'member@example.com', password: 'valid' })).unwrap();
  store.dispatch(setUser(result.user));
  assert.equal((await getNotifications(store)).data[0].id, 'member-notification');
  assert.equal((await store.dispatch(notificationsApi.endpoints.getUnreadCount.initiate()).unwrap()).count, 1);
});

for (const endpoint of ['login', 'register']) {
  test(`successful ${endpoint} clears data left by a previous session`, async (t) => {
    const store = setup(t);
    await getNotifications(store);
    await store.dispatch(authApi.endpoints[endpoint].initiate({ name: 'Member', email: 'member@example.com', password: 'valid' })).unwrap();
    assert.deepEqual(store.getState().api.queries, {});
    assert.equal((await getNotifications(store)).data[0].id, 'member-notification');
  });
}

test('failed login does not discard the existing session cache', async (t) => {
  const store = setup(t);
  await getNotifications(store);
  await assert.rejects(store.dispatch(authApi.endpoints.login.initiate({ email: 'member@example.com', password: 'wrong' })).unwrap());
  assert.equal(store.getState().auth.user.id, 'admin');
  assert.equal((await getNotifications(store)).data[0].id, 'admin-notification');
});

test('a delayed admin response cannot replace the member notification cache', async (t) => {
  const store = setup(t);
  const fetch = globalThis.fetch;
  let markStarted;
  let releaseResponse;
  const started = new Promise(resolve => { markStarted = resolve; });
  const delayed = new Promise(resolve => { releaseResponse = resolve; });
  let holdResponse = true;
  t.mock.method(globalThis, 'fetch', async (request) => {
    if (new URL(request.url).pathname === '/notifications' && holdResponse) {
      holdResponse = false;
      markStarted();
      return delayed;
    }
    return fetch(request);
  });
  t.after(() => releaseResponse(Response.json({ data: [], total: 0 })));
  const adminRequest = getNotifications(store);
  await started;
  await store.dispatch(authApi.endpoints.logout.initiate()).unwrap();
  await store.dispatch(authApi.endpoints.login.initiate({ email: 'member@example.com', password: 'valid' })).unwrap();
  assert.equal((await getNotifications(store)).data[0].id, 'member-notification');
  releaseResponse(Response.json({ data: [{ id: 'admin-notification' }], total: 1 }));
  await adminRequest;
  assert.equal(notificationsApi.endpoints.getNotifications.select(notificationArgs)(store.getState()).data.data[0].id, 'member-notification');
});
