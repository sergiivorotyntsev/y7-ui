// y7-ui v0.1.1 — the Stage 2 follow-ups (the portal list fixed these locally; the kit now owns them).
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { StatusChip } from '../src/primitives/Chip/Chip.jsx';
import { Icon } from '../src/primitives/shared/Icon.jsx';

// a plain path from the repo root: under jsdom `URL` is jsdom's class, which node's fs does not take as a file URL
const src = p => readFileSync(resolve(process.cwd(), p), 'utf8');

describe('v0.1.1', () => {
  it('StatusChip has a filled variant (the L1 colour as the background, its on-fill token as the text)', () => {
    const { container } = render(<StatusChip tone="done" variant="filled">Delivered</StatusChip>);
    expect(container.firstElementChild.dataset.variant).toBe('filled');
    expect(src('src/primitives/Chip/Chip.module.css')).toMatch(/\[data-variant="filled"\][^{]*\{[^}]*--y7-color-status-[a-z-]*on-fill|on-fill/);
  });
  it('the icon inventory has a refresh glyph', () => {
    const { container } = render(<Icon name="refresh" />);
    expect(container.querySelector('svg path')).not.toBeNull();
  });
  it('SearchField: the input fills its control (the tap target is the whole box), 44 px on touch', () => {
    const css = src('src/primitives/SearchField/SearchField.module.css');
    expect(css).toMatch(/\.input\s*\{[^}]*block-size:\s*100%/);
    expect(css).toMatch(/pointer:\s*coarse[\s\S]*\.input[^{]*\{[^}]*min-block-size:\s*var\(--y7-size-control-touch\)/);
  });
  it('Select: React Aria\'s autofill-only hidden <select> is not laid out (it read as a 45x20 tap target)', () => {
    expect(src('src/styles/base.css')).toMatch(/\.y7-ui\s+\[data-testid="hidden-select-container"\]\s*\{\s*display:\s*none/);
  });
});
