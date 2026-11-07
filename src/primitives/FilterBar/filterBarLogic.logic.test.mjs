import { test } from 'node:test';
import assert from 'node:assert/strict';
import { removeChip, clearAll, countApplied, sheetReducer, initialSheet } from './filterBarLogic.js';

const chips = [{ id: 'status', label: 'Status: Active' }, { id: 'date', label: 'Nov 6 – 7' }];

test('removeChip drops exactly the chip with that id and keeps order', () => {
  assert.deepEqual(removeChip(chips, 'status'), [chips[1]]);
  assert.deepEqual(removeChip(chips, 'missing'), chips);
});
test('clearAll gives an empty list and never mutates the input', () => {
  const copy = [...chips]; assert.deepEqual(clearAll(chips), []); assert.deepEqual(chips, copy);
});
test('countApplied counts chips for the narrow "Filters (N)" button', () => {
  assert.equal(countApplied(chips), 2); assert.equal(countApplied([]), 0); assert.equal(countApplied(undefined), 0);
});
test('sheet: edits are a draft until Apply; Cancel discards; Clear empties the draft only', () => {
  let s = initialSheet({ status: 'active' });
  s = sheetReducer(s, { type: 'edit', key: 'status', value: 'closed' });
  assert.equal(s.draft.status, 'closed'); assert.equal(s.applied.status, 'active');
  const cancelled = sheetReducer(s, { type: 'cancel' });
  assert.deepEqual(cancelled.draft, cancelled.applied); assert.equal(cancelled.applied.status, 'active');
  const cleared = sheetReducer(s, { type: 'clear' });
  assert.deepEqual(cleared.draft, {}); assert.equal(cleared.applied.status, 'active');
  const applied = sheetReducer(s, { type: 'apply' });
  assert.equal(applied.applied.status, 'closed'); assert.deepEqual(applied.draft, applied.applied);
});
