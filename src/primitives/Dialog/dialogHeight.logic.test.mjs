// v0.1.3: a real dialog height. Before it `.dialog { max-block-size: inherit }` inherited the modal's `100%`, which against
// an indefinite height is no limit: a long body outgrew the viewport instead of scrolling inside (the phone filter sheet too).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(process.cwd(), 'src/primitives/Dialog/Dialog.module.css'), 'utf8');
const rule = sel => (css.match(new RegExp(`(^|\\n)\\s*${sel.replace('.', '\\.')}\\s*\\{([^}]*)\\}`)) || [])[2] || '';

test('the modal caps at the viewport minus the overlay padding (dvh), not at a percentage of nothing', () => {
  assert.match(rule('.modal'), /max-block-size:\s*calc\(100dvh - 2 \* var\(--y7-space-lg\)\)/);
  assert.doesNotMatch(rule('.modal'), /max-block-size:\s*100%/);
});

test('the dialog inherits a definite cap and its body scrolls inside', () => {
  assert.match(rule('.dialog'), /max-block-size:\s*inherit/);
  assert.match(rule('.body'), /overflow:\s*auto/);
  assert.match(rule('.body'), /min-block-size:\s*0/);
});

test('the phone sheet caps in dvh too (no percentage)', () => {
  const phone = css.slice(css.indexOf('@media (max-width: 767px)'));
  assert.match(phone, /\.sheet\s*\{[^}]*max-block-size:\s*calc\(100dvh - var\(--y7-space-xl\)\)/);
  assert.doesNotMatch(phone, /max-block-size:\s*90%/);
});
