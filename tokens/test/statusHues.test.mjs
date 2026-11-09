// y7-ui v0.1.2 (Sergii's review of the live list, Nov 8): EVERY status gets its own colour — "Listed" and "Carrier
// assigned" were the same dark blue. The badge (filled) and the row's left bar use the status FILL; these tests pin one hue
// per status so two statuses can never share a colour again, and keep every text pair ≥ 4.5:1. Run: node --test tokens/test/
import test from 'node:test';
import assert from 'node:assert/strict';
import * as site from '../dist/site.js';
import * as admin from '../dist/admin.js';

export const PIPELINE = ['received', 'listed', 'assigned', 'transit', 'checking', 'done', 'needs-you', 'blocked', 'cancelled'];
const hex = h => { const m = /^#([0-9a-f]{6})$/i.exec(h); assert.ok(m, `not a hex colour: ${h}`); return [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16) / 255); };
function hsl(h) { const [r, g, b] = hex(h); const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l }; const s = d / (1 - Math.abs(2 * l - 1));
  const hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; return { h: (hue * 60 + 360) % 360, s, l }; }
const lin = v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = h => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };

for (const [name, { tokens: t }] of Object.entries({ site, admin })) {
  test(`${name}: every status has fill, on-fill, fg, bg`, () => {
    for (const s of PIPELINE) for (const part of ['fill', 'on-fill', 'fg', 'bg']) assert.equal(typeof t[`color-status-${s}-${part}`], 'string', `${s}-${part}`);
  });
  // Claude's ruling (Nov 9): Cancelled is NOT red (EXPSTAT ruling 1 stands) — a neutral OUTLINE chip; the only second
  // neutral allowed, and only because it is drawn as an outline (never filled), so it cannot read as Received's slate
  test(`${name}: one hue per status — chromatic fills ≥ 15° apart; the neutrals are exactly Received (filled) and Cancelled (outline)`, () => {
    const fills = PIPELINE.map(s => [s, hsl(t[`color-status-${s}-fill`])]);
    const neutral = fills.filter(([, c]) => c.s < 0.3).map(([s]) => s);
    assert.deepEqual(neutral, ['received', 'cancelled'], `achromatic fills: ${neutral}`);
    const chroma = fills.filter(([s]) => !neutral.includes(s));
    for (let i = 0; i < chroma.length; i++) for (let j = i + 1; j < chroma.length; j++) {
      const d = gap(chroma[i][1].h, chroma[j][1].h);
      assert.ok(d >= 15, `${chroma[i][0]} (${chroma[i][1].h.toFixed(0)}°) and ${chroma[j][0]} (${chroma[j][1].h.toFixed(0)}°) are ${d.toFixed(1)}° apart`);
    }
  });
  test(`${name}: badge text on the fill ≥ 4.5:1, tint text on the tint ≥ 4.5:1`, () => {
    for (const s of PIPELINE) {
      const f = ratio(t[`color-status-${s}-on-fill`], t[`color-status-${s}-fill`]);
      const g = ratio(t[`color-status-${s}-fg`], t[`color-status-${s}-bg`]);
      assert.ok(f >= 4.5, `${name} ${s} filled ${f.toFixed(2)}:1`); assert.ok(g >= 4.5, `${name} ${s} tint ${g.toFixed(2)}:1`);
    }
  });
}

test('Cancelled is always drawn as an outline chip, even when a filled badge is asked for', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../src/primitives/Chip/Chip.module.css', import.meta.url), 'utf8');
  assert.match(css, /\.status\[data-tone="cancelled"\]\[data-variant="filled"\]\s*\{[^}]*background-color:\s*transparent/);
});
