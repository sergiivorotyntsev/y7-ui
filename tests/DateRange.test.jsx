import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateRange, CalendarDate, Y7Provider } from '../src/index.js';

const range = { start: new CalendarDate(2026, 11, 6), end: new CalendarDate(2026, 11, 7) };

describe('DateRange', () => {
  it('empty shows the muted words from props and renders no native date input (C4)', () => {
    const { container } = render(<DateRange label="Pickup date" emptyText="Any date" clearLabel="Clear the date range" />);
    expect(screen.getByText('Any date')).toHaveAttribute('data-placeholder');
    expect(container.querySelector('input[type="date"]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Clear the date range' })).toBeNull();
  });
  it('set shows a localized range and a clear × that calls onChange(null)', async () => {
    const onChange = vi.fn();
    render(<Y7Provider locale="en"><DateRange label="Pickup date" emptyText="Any date" clearLabel="Clear the date range" value={range} onChange={onChange} /></Y7Provider>);
    expect(screen.getByText((t) => t.replace(/\s/g, ' ') === 'Nov 6 – 7')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Clear the date range' }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
  it('follows the provider locale: Polish month names', () => {
    render(<Y7Provider locale="pl"><DateRange label="Data odbioru" emptyText="Dowolna data" clearLabel="Wyczyść" value={range} /></Y7Provider>);
    expect(screen.getByText(/lis/i)).toBeInTheDocument();
  });
  it('the trigger is labelled by the field label and its value', () => {
    render(<DateRange label="Pickup date" emptyText="Any date" clearLabel="Clear" />);
    expect(screen.getByRole('button', { name: /Pickup date.*Any date/ })).toBeInTheDocument();
  });
});
