// app.test.js
// Uses Node's built-in test runner (node --test), so no extra test framework
// is needed. supertest sends fake HTTP requests straight to the Express app.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('GET / returns Hello World', async () => {
  const res = await request(app).get('/');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { message: 'Hello World' });
});

test('GET /healthz reports ok', async () => {
  const res = await request(app).get('/healthz');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('does not leak the X-Powered-By header', async () => {
  const res = await request(app).get('/');
  assert.equal(res.headers['x-powered-by'], undefined);
});
