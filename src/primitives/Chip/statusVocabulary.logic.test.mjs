import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STATUS_TONES, isStatusTone, needsActionWords, assertStatusProps } from './statusVocabulary.js';

test('the L1 vocabulary is exactly five tones', () => {
  assert.deepEqual(STATUS_TONES, ['done', 'progress', 'needs-you', 'blocked', 'neutral']);
  assert.ok(isStatusTone('done')); assert.ok(!isStatusTone('warning')); assert.ok(!isStatusTone('amber'));
});
test('amber (needs-you) always needs the words of what to do; the others do not', () => {
  assert.ok(needsActionWords('needs-you'));
  for (const t of ['done', 'progress', 'blocked', 'neutral']) assert.ok(!needsActionWords(t));
});
test('assertStatusProps returns a problem list, empty when valid', () => {
  assert.deepEqual(assertStatusProps({ tone: 'done', children: 'Delivered' }), []);
  assert.ok(assertStatusProps({ tone: 'needs-you', children: 'Payment due' }).length > 0, 'amber without action');
  assert.deepEqual(assertStatusProps({ tone: 'needs-you', children: 'Payment due', action: 'Pay the carrier' }), []);
  assert.ok(assertStatusProps({ tone: 'warning', children: 'x' }).length > 0, 'unknown tone');
  assert.ok(assertStatusProps({ tone: 'done', children: '' }).length > 0, 'no words: colour alone');
});
