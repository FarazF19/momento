import test from 'node:test';
import assert from 'node:assert/strict';
import { appOrigin, authCallbackUrl, safeNext } from '../src/lib/app-origin.ts';
test('missing or blank APP_URL uses the trusted production domain', () => {
  for (const APP_URL of [undefined, '', '   ', 'invalid', 'javascript:alert(1)', 'https://u:p@example.com', 'http://example.com'])
    assert.equal(appOrigin({ APP_URL, NODE_ENV: 'production' }), 'https://momento-nine-rho.vercel.app');
});
test('configured origin and development origin are normalized', () => {
  assert.equal(appOrigin({ APP_URL: 'https://momento.example/path' }), 'https://momento.example');
  assert.equal(appOrigin({ NODE_ENV: 'development' }), 'http://localhost:3000');
});
test('safe next paths stay inside the app', () => {
  assert.equal(safeNext('/studio'), '/studio');
  assert.equal(safeNext('https://evil.example'), '/dashboard');
  assert.equal(safeNext('//evil.example'), '/dashboard');
  assert.equal(authCallbackUrl('http://localhost:3000', '/studio'), 'http://localhost:3000/auth/callback?next=%2Fstudio');
  assert.equal(authCallbackUrl('http://localhost:3000', '/studio', 'creator'), 'http://localhost:3000/auth/callback?next=%2Fstudio&role=creator');
});
