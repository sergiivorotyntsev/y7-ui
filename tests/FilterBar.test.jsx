import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar, Select } from '../src/index.js';

const labels = { filters: (n) => `Filters (${n})`, clearAll: 'Clear all', apply: 'Apply', clear: 'Clear', close: 'Close', sheetTitle: 'Filters', remove: (c) => `Remove filter ${c.label}`, group: 'Load filters', applied: 'Applied filters' };
const chips = [{ id: 'status', label: 'Status: Active' }, { id: 'date', label: 'Nov 6 – 7' }];

describe('FilterBar', () => {
  it('renders the chips with a named × each and Clear all; callbacks get the chip id', async () => {
    const onRemoveChip = vi.fn(); const onClearAll = vi.fn();
    render(<FilterBar chips={chips} onRemoveChip={onRemoveChip} onClearAll={onClearAll} labels={labels}><Select label="Status" placeholder="Any status" items={[]} emptyText="No options" /></FilterBar>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter Status: Active' }));
    expect(onRemoveChip).toHaveBeenCalledWith('status');
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
  it('no chips: no chip row and no Clear all', () => {
    render(<FilterBar chips={[]} labels={labels}><Select label="Status" placeholder="Any status" items={[]} emptyText="No options" /></FilterBar>);
    expect(screen.queryByRole('button', { name: 'Clear all' })).toBeNull();
  });
  it('forces one label position on every control (C3)', () => {
    render(<FilterBar chips={[]} labels={labels} labelPosition="inline"><Select label="Status" placeholder="Any status" items={[]} emptyText="No options" /></FilterBar>);
    expect(screen.getByText('Status').closest('[data-label-position]')).toHaveAttribute('data-label-position', 'inline');
  });
  it('narrow: a "Filters (N)" button opens a sheet with the controls and Apply / Clear', async () => {
    const onClearAll = vi.fn();
    render(<FilterBar narrow chips={chips} onClearAll={onClearAll} labels={labels}><Select label="Status" placeholder="Any status" items={[]} emptyText="No options" /></FilterBar>);
    await userEvent.click(screen.getByRole('button', { name: 'Filters (2)' }));
    const dialog = await screen.findByRole('dialog', { name: 'Filters' });
    expect(dialog).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClearAll).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
  });
});
