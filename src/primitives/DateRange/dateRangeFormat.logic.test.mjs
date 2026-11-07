import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateRange, toBcp47, SUPPORTED_LOCALES } from './dateRangeFormat.js';

const d = (y, m, day) => ({ year: y, month: m, day });
const NOW = { year: 2026, month: 11, day: 7 };

test('empty range gives null so the control shows the muted words from props (C4), never a mask', () => {
  assert.equal(formatDateRange(null, 'en', NOW), null);
  assert.equal(formatDateRange({ start: null, end: null }, 'en', NOW), null);
});

test('en: a range in the current month and year reads "Nov 6 – 7"', () => {
  const out = formatDateRange({ start: d(2026, 11, 6), end: d(2026, 11, 7) }, 'en', NOW);
  assert.equal(out.replace(/\s/g, ' '), 'Nov 6 – 7');
});

test('en: a range across months reads "Oct 28 – Nov 3"', () => {
  assert.equal(formatDateRange({ start: d(2026, 10, 28), end: d(2026, 11, 3) }, 'en', NOW).replace(/\s/g, ' '), 'Oct 28 – Nov 3');
});

test('en: a range outside the current year carries the year', () => {
  const out = formatDateRange({ start: d(2025, 12, 30), end: d(2026, 1, 2) }, 'en', NOW);
  assert.match(out, /2025/); assert.match(out, /2026/);
});

test('en: a single day reads as one date', () => {
  assert.equal(formatDateRange({ start: d(2026, 11, 6), end: d(2026, 11, 6) }, 'en', NOW).replace(/\s/g, ' '), 'Nov 6');
});

test('pl, uk, ru: localized month names, en dash (never an em dash, X4)', () => {
  const r = { start: d(2026, 11, 6), end: d(2026, 11, 7) };
  const pl = formatDateRange(r, 'pl', NOW); const uk = formatDateRange(r, 'uk', NOW); const ru = formatDateRange(r, 'ru', NOW);
  assert.match(pl, /lis/i, `pl: ${pl}`);
  assert.match(uk, /лист/i, `uk: ${uk}`);
  assert.match(ru, /ноя/i, `ru: ${ru}`);
  for (const s of [pl, uk, ru]) { assert.doesNotMatch(s, /—/, 'em dash'); assert.match(s, /–|-/, 'dash present'); }
});

test('locale codes map to BCP 47 tags React Aria understands; uk is Ukrainian, not UK English', () => {
  assert.equal(toBcp47('en'), 'en-US'); assert.equal(toBcp47('pl'), 'pl-PL'); assert.equal(toBcp47('uk'), 'uk-UA'); assert.equal(toBcp47('ru'), 'ru-RU');
  assert.equal(toBcp47('ua'), 'uk-UA', 'the site uses /ua/ for Ukrainian');
  assert.equal(toBcp47('de-DE'), 'de-DE', 'a full tag passes through');
  assert.deepEqual(SUPPORTED_LOCALES, ['en', 'pl', 'uk', 'ru']);
});
