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

test('v0.1.4 wide size: min(1120px, 94vw), the same dvh cap; a full-height sheet at 480px and below', () => {
  assert.match(rule('.wide'), /inline-size:\s*min\(1120px, 94vw\)/);
  const phone = css.slice(css.indexOf('@media (max-width: 480px)'));
  assert.match(phone, /\.wide\s*\{[^}]*inline-size:\s*100%[^}]*block-size:\s*100dvh[^}]*max-block-size:\s*100dvh/);
});

test('v0.1.4 the header is sticky inside the dialog, so it stays while the body scrolls', () => {
  assert.match(rule('.header'), /position:\s*sticky/);
  assert.match(rule('.header'), /inset-block-start:\s*0/);
  assert.match(rule('.headerActions'), /display:\s*flex/);
});

// v0.1.5 (Claude, Nov 10): three things the website's own window had before it moved onto the kit Dialog.
test('v0.1.5 the body never chains its scroll to the page (overscroll-behavior: contain)', () => {
  assert.match(rule('.body'), /overscroll-behavior:\s*contain/);
});

test('v0.1.5 a hairline under the wide dialog\'s sticky header (tokens only)', () => {
  assert.match(css, /\.wide \.header\s*\{[^}]*border-block-end:\s*var\(--y7-border-width-hairline\) solid var\(--y7-color-border-subtle\)/);
});

test('v0.1.5 the wide sheet at 480px and below keeps its last row clear of the home indicator (safe-area padding)', () => {
  const phone = css.slice(css.indexOf('@media (max-width: 480px)'));
  assert.match(phone, /\.wide \.body\s*\{[^}]*padding-block-end:\s*calc\(var\(--y7-space-lg\) \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(phone, /\.wide \.footer\s*\{[^}]*padding-block-end:\s*calc\(var\(--y7-space-xl\) \+ env\(safe-area-inset-bottom\)\)/);
});
