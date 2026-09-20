import test from 'node:test';
import assert from 'node:assert/strict';
import { appOrigin } from '../src/lib/app-origin.ts';
test('missing or blank APP_URL uses the trusted production domain', () => {
  for (const APP_URL of [undefined, '', '   ', 'invalid', 'javascript:alert(1)', 'https://u:p@example.com', 'http://example.com'])
    assert.equal(appOrigin({ APP_URL, NODE_ENV: 'production' }), 'https://momento-nine-rho.vercel.app');
});
test('configured origin and development origin are normalized', () => {
  assert.equal(appOrigin({ APP_URL: 'https://momento.example/path' }), 'https://momento.example');
  assert.equal(appOrigin({ NODE_ENV: 'development' }), 'http://localhost:3000');
});
