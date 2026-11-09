// Claude's rulings on Stage 1 (2026-11-07): (1) site controls use DESIGN.md's 12 px radius, admin 10 px; (2) the control
// border is not a fixed alpha — it must MEASURE ≥ 3:1 non-text contrast (WCAG 1.4.11) against the surfaces controls
// sit on, paper and board alike; (3) status text on its tint ≥ 4.5:1 (WCAG 1.4.3). Measured here from the built
// tokens, so a future value that fails is a failed test, not a review comment. Run: node --test tokens/test/
import test from 'node:test';
import assert from 'node:assert/strict';
import * as site from '../dist/site.js';
import * as admin from '../dist/admin.js';

function parse(c) {
  let m = c.match(/^#([0-9a-f]{6})$/i);
  if (m) return { rgb: [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16)), a: 1 };
  m = c.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+))?\s*\)$/i);
  if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`unparsed colour ${c}`);
}
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const over = (fg, bg) => fg.rgb.map((v, i) => Math.round(fg.a * v + (1 - fg.a) * bg.rgb[i]));
export function ratio(fgColour, bgColour) {
  const bg = parse(bgColour); const fg = over(parse(fgColour), bg);
  const [a, b] = [lum(fg), lum(bg.rgb)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const THEMES = { site, admin };
const STATUSES = ['done', 'progress', 'needs-you', 'blocked', 'neutral'];
export const measured = {};

for (const [name, mod] of Object.entries(THEMES)) {
  const t = mod.tokens;
  test(`${name}: the control border measures ≥ 3:1 against every surface a control sits on (WCAG 1.4.11)`, () => {
    for (const s of ['color-surface-page', 'color-surface-panel', 'color-surface-overlay', 'color-control-bg']) {
      const r = ratio(t['color-border-control'], t[s]);
      measured[`${name} border-control on ${s}`] = r.toFixed(2);
      assert.ok(r >= 3, `${name}: border-control on ${s} = ${r.toFixed(2)}:1`);
    }
  });
  test(`${name}: the inverse control border measures ≥ 3:1 on the inverse surfaces (site: board)`, () => {
    for (const s of ['color-surface-inverse', 'color-surface-inverse-panel']) {
      const r = ratio(t['color-border-control-inverse'], t[s]);
      measured[`${name} border-control-inverse on ${s}`] = r.toFixed(2);
      assert.ok(r >= 3, `${name}: border-control-inverse on ${s} = ${r.toFixed(2)}:1`);
    }
  });
  test(`${name}: status text on its own tint ≥ 4.5:1 (WCAG 1.4.3)`, () => {
    for (const s of STATUSES) {
      const r = ratio(t[`color-status-${s}-fg`], t[`color-status-${s}-bg`]);
      measured[`${name} status ${s} fg on bg`] = r.toFixed(2);
      assert.ok(r >= 4.5, `${name}: status ${s} = ${r.toFixed(2)}:1`);
    }
  });
}

test('control radius: site 12 px (DESIGN.md), admin 10 px', () => {
  assert.equal(site.tokens['radius-control'], '12px');
  assert.equal(admin.tokens['radius-control'], '10px');
});

test.after(() => { console.log('MEASURED', JSON.stringify(measured)); });

// v0.1.1 (Stage 2 follow-up): a FILLED status chip (the portal list's badge) — its text on the status colour itself
for (const [name, mod] of Object.entries(THEMES)) {
  test(`${name}: text on a filled status chip ≥ 4.5:1 (on-fill on the status fg)`, () => {
    for (const s of STATUSES) {
      const r = ratio(mod.tokens[`color-status-${s}-on-fill`], mod.tokens[`color-status-${s}-fg`]);
      measured[`${name} filled ${s}`] = r.toFixed(2);
      assert.ok(r >= 4.5, `${name}: filled ${s} = ${r.toFixed(2)}:1`);
    }
  });
}
