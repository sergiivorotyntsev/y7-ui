import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog, Button } from '../src/index.js';

// v0.1.4 (Claude, Nov 9): a wide size and a header-actions slot, so the website's "BOL & photos" window can move onto the
// kit Dialog (min(1120px, 94vw), "BOL & photos · N", vehicle and Load ID muted, Download all and × in a sticky header).
describe('Dialog', () => {
  it('default: the title names the dialog, the × is named, size is "default" and existing callers are unchanged', async () => {
    const onOpenChange = vi.fn();
    render(<Dialog isOpen onOpenChange={onOpenChange} title="Filters" closeLabel="Close">body</Dialog>);
    const dialog = screen.getByRole('dialog', { name: 'Filters' });
    expect(dialog.closest('[data-size]')).toHaveAttribute('data-size', 'default');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('wide: data-size="wide"; a subtitle and header actions render in the header, before the ×', () => {
    render(<Dialog isOpen title="BOL & photos · 21" subtitle="2021 Toyota Camry · Load ID DEMO-3000" closeLabel="Close" size="wide"
      headerActions={<Button variant="secondary" size="sm">Download all</Button>}>grid</Dialog>);
    const dialog = screen.getByRole('dialog', { name: 'BOL & photos · 21' });
    expect(dialog.closest('[data-size]')).toHaveAttribute('data-size', 'wide');
    const header = dialog.querySelector('header');
    expect(header).toHaveTextContent('2021 Toyota Camry · Load ID DEMO-3000');
    const buttons = [...header.querySelectorAll('button')].map(b => b.getAttribute('aria-label') || b.textContent);
    expect(buttons).toEqual(['Download all', 'Close']);
  });
  it('the subtitle is not part of the accessible name (the title alone names the dialog)', () => {
    render(<Dialog isOpen title="BOL & photos · 3" subtitle="Load ID DEMO-1" closeLabel="Close" size="wide">x</Dialog>);
    expect(screen.getByRole('dialog', { name: 'BOL & photos · 3' })).toBeInTheDocument();
  });
});
