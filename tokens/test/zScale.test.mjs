// v0.1.3 (PORTALROW-1 photo window, Claude's ruling Nov 9): one stacking scale, content < sticky header < drawer < overlay < toast.
// Before it the overlay (50) and the drawer (40) sat under a host app's sticky header (the website's is 100), so the header
// painted over every kit dialog, undimmed, and covered its top.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = JSON.parse(readFileSync(resolve(process.cwd(), 'tokens/src/base.tokens.json'), 'utf8'));
const z = Object.fromEntries(Object.entries(base.z).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, v.$value]));

test('the z scale: content < sticky-header < drawer < overlay < toast', () => {
  for (const k of ['content', 'sticky-header', 'drawer', 'overlay', 'toast']) assert.equal(typeof z[k], 'number', k);
  assert.ok(z.content < z['sticky-header'], 'content under the sticky header');
  assert.ok(z['sticky-header'] < z.drawer, 'a drawer covers the sticky header');
  assert.ok(z.drawer < z.overlay, 'a modal covers a drawer');
  assert.ok(z.overlay < z.toast, 'toasts stay above modals');
});

test('the overlay clears a host page\'s persistent chrome (the website\'s fixed bars sit at 990 to 1000)', () => {
  assert.ok(z.overlay > 1000);
  assert.ok(z.drawer > 1000);
});

test('the sticky header is the website\'s own value, so the host can adopt the token without moving', () => {
  assert.equal(z['sticky-header'], 100);
});
