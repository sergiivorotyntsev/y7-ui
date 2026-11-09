// Token build contract (runs on tokens/dist; `npm run tokens` first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as site from '../dist/site.js';
import * as admin from '../dist/admin.js';

const THEMES = { site, admin };
const css = Object.fromEntries(Object.keys(THEMES).map((t) => [t, readFileSync(new URL(`../dist/${t}.css`, import.meta.url), 'utf8')]));

const SEMANTIC_REQUIRED = [
  'color-surface-page', 'color-surface-panel', 'color-surface-raised', 'color-surface-overlay', 'color-surface-inverse',
  'color-text-primary', 'color-text-secondary', 'color-text-muted', 'color-text-link', 'color-text-on-accent', 'color-text-disabled',
  'color-border-subtle', 'color-border-control', 'color-border-strong',
  'color-accent-base', 'color-accent-hover', 'color-accent-tint',
  'color-focus-ring', 'color-focus-ring-on-inverse', 'color-focus-ring-quiet',
  'color-control-bg', 'color-control-bg-hover', 'color-control-bg-disabled', 'color-control-placeholder',
  'color-skeleton-base', 'color-scrim',
  'radius-control', 'radius-card', 'radius-panel', 'radius-pill',
  'motion-duration-fast', 'motion-duration-normal', 'motion-duration-slow', 'motion-easing-standard',
  'shadow-card', 'shadow-overlay',
  'space-xxs', 'space-xs', 'space-sm', 'space-md', 'space-lg', 'space-xl', 'space-2xl', 'space-3xl',
  'size-control-sm', 'size-control-md', 'size-control-lg', 'size-control-touch', 'size-row',
  'font-family-ui', 'font-family-mono', 'font-size-2xs', 'font-size-xs', 'font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl',
  'font-weight-regular', 'font-weight-medium', 'font-weight-semibold', 'font-weight-bold',
  'focus-width', 'focus-offset', 'z-content', 'z-dropdown', 'z-sticky-header', 'z-drawer', 'z-overlay', 'z-toast',
];
const STATUSES = ['done', 'progress', 'needs-you', 'blocked', 'neutral'];
const FEEDBACK = ['error', 'success', 'info', 'needs-you'];

for (const [name, mod] of Object.entries(THEMES)) {
  test(`${name}: every semantic token resolves to a concrete CSS value`, () => {
    for (const key of SEMANTIC_REQUIRED) {
      const v = mod.tokens[key];
      assert.ok(v !== undefined, `${key} missing`);
      assert.ok(typeof v === 'string' || typeof v === 'number', `${key} is not a CSS value: ${JSON.stringify(v)}`);
      if (typeof v === 'string') { assert.ok(!v.includes('{'), `${key} has an unresolved reference: ${v}`); assert.ok(!v.includes('[object'), `${key} is an unserialised object`); }
    }
  });
  test(`${name}: status tokens exist for the L1 vocabulary (fg, bg, border each)`, () => {
    for (const s of STATUSES) for (const part of ['fg', 'bg', 'border']) assert.equal(typeof mod.tokens[`color-status-${s}-${part}`], 'string', `color-status-${s}-${part}`);
    for (const f of FEEDBACK) for (const part of ['fg', 'bg', 'border']) assert.equal(typeof mod.tokens[`color-feedback-${f}-${part}`], 'string', `color-feedback-${f}-${part}`);
  });
  test(`${name}: status colours are distinct from each other`, () => {
    const fgs = STATUSES.map((s) => mod.tokens[`color-status-${s}-fg`]);
    assert.equal(new Set(fgs).size, fgs.length, `status fg colours collide: ${fgs}`);
  });
  test(`${name}: no hex-named tokens (semantic names only)`, () => {
    for (const key of Object.keys(mod.tokens)) for (const seg of key.split('-')) assert.ok(!(/^[0-9a-f]{3,8}$/i.test(seg) && /\d/.test(seg)), `token name carries a hex: ${key}`);
  });
  test(`${name}: the type scale has six sizes between 11 and 20 px, ascending`, () => {
    const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'].map((k) => parseFloat(mod.tokens[`font-size-${k}`]));
    assert.equal(sizes.length, 6);
    assert.equal(sizes[0], 11); assert.equal(sizes.at(-1), 20);
    for (let i = 1; i < sizes.length; i++) assert.ok(sizes[i] > sizes[i - 1], `type scale not ascending at ${i}`);
  });
  test(`${name}: one UI font stack starts with system-ui (T2)`, () => {
    assert.match(mod.tokens['font-family-ui'], /^system-ui,/);
    assert.doesNotMatch(mod.tokens['font-family-ui'], /JetBrains|Oswald/, 'a Latin-only webfont must not be used for controls');
  });
  test(`${name}: control heights: toolbar 36-40 px, touch 44 px`, () => {
    const md = parseFloat(mod.tokens['size-control-md']);
    assert.ok(md >= 36 && md <= 40, `size-control-md ${md}`);
    assert.equal(parseFloat(mod.tokens['size-control-touch']), 44);
  });
  test(`${name}: focus ring is 2px with 2px offset`, () => {
    assert.equal(mod.tokens['focus-width'], '2px'); assert.equal(mod.tokens['focus-offset'], '2px');
  });
  test(`${name}: CSS output defines every JS token and both selectors`, () => {
    for (const key of Object.keys(mod.tokens)) assert.ok(css[name].includes(`--y7-${key}:`), `--y7-${key} not in ${name}.css`);
    assert.ok(css[name].includes(`:root, [data-y7-theme="${name}"]`));
  });
}

test('admin: the focus colour is its own token and is never the error colour (X2)', () => {
  const focus = admin.tokens['color-focus-ring'];
  const errors = [admin.tokens['color-feedback-error-fg'], admin.tokens['color-status-blocked-fg'], admin.tokens['color-accent-base'], admin.tokens['color-accent-hover']];
  for (const e of errors) assert.notEqual(focus.toLowerCase(), e.toLowerCase(), `admin focus ring equals an error/red colour: ${focus}`);
  assert.notEqual(admin.tokens['color-focus-ring-on-inverse'].toLowerCase(), admin.tokens['color-feedback-error-fg'].toLowerCase());
});

test('site: the focus ring is signal red on paper and the bright red on dark (DESIGN.md Focus-Visible Law)', () => {
  assert.equal(site.tokens['color-focus-ring'], '#d70f24');
  assert.equal(site.tokens['color-focus-ring-on-inverse'], '#ef3a4e');
});

test('site: Bonded Pine is the done/success colour; the quiet ring differs from the red ring', () => {
  assert.equal(site.tokens['color-status-done-fg'], '#0f6e56');
  assert.equal(site.tokens['color-status-done-bg'], '#e1f5ee');
  assert.notEqual(site.tokens['color-focus-ring-quiet'], site.tokens['color-focus-ring']);
});

test('both themes expose the same token names (parity)', () => {
  assert.deepEqual(Object.keys(site.tokens).sort(), Object.keys(admin.tokens).sort());
});
