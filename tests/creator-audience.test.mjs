import test from 'node:test';
import assert from 'node:assert/strict';
import { creatorAudienceError } from '../src/lib/verification.ts';
test('creator eligibility requires a confirmed 10K count on one platform', () => {
  for (const count of [null, NaN, -1, 0, 5000, 9999, 10000.1]) assert.ok(creatorAudienceError(count));
  assert.equal(creatorAudienceError(10000), null);
  assert.equal(creatorAudienceError(150000), null);
});
