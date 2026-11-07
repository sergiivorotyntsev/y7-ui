// Claude's Stage 1 ruling (7), 2026-11-07: no wrapper div — the theme lives on <html> (data-y7-theme) or in :root CSS,
// so adopting the library never changes an app's layout. Every primitive root carries .y7-ui itself (base.css).
import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Y7Provider } from '../src/primitives/Provider/Y7Provider.jsx';

afterEach(() => { cleanup(); delete document.documentElement.dataset.y7Theme; });

describe('Y7Provider', () => {
  it('renders no element of its own: the children are the container’s own children', () => {
    const { container } = render(<Y7Provider theme="admin"><span data-testid="child">x</span></Y7Provider>);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild.dataset.testid).toBe('child');
    expect(container.querySelector('[data-y7-theme]')).toBeNull();
  });
  it('puts the theme on <html>', () => {
    render(<Y7Provider theme="admin"><span /></Y7Provider>);
    expect(document.documentElement.dataset.y7Theme).toBe('admin');
  });
  it('leaves <html> alone when the app owns the theme (static :root CSS or its own attribute)', () => {
    document.documentElement.dataset.y7Theme = 'site';
    render(<Y7Provider theme="admin" applyTheme={false}><span /></Y7Provider>);
    expect(document.documentElement.dataset.y7Theme).toBe('site');
  });
});
