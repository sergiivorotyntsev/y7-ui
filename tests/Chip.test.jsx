import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusChip, FilterChip, Banner, Skeleton, Select } from '../src/index.js';

afterEach(() => vi.restoreAllMocks());

describe('StatusChip (L1)', () => {
  it('exposes the tone and the words', () => {
    render(<StatusChip tone="done">Delivered</StatusChip>);
    expect(screen.getByText('Delivered').closest('[data-tone]')).toHaveAttribute('data-tone', 'done');
  });
  it('amber without action words warns in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<StatusChip tone="needs-you">Payment due</StatusChip>);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/needs-you.*words of what to do/));
  });
  it('amber with action renders the action words', () => {
    render(<StatusChip tone="needs-you" action="Pay the carrier">Payment due</StatusChip>);
    expect(screen.getByText('Pay the carrier')).toBeInTheDocument();
  });
});

describe('FilterChip', () => {
  it('the × carries the accessible name from props', () => {
    render(<FilterChip removeLabel="Remove filter Status" onRemove={() => {}}>Status: Active</FilterChip>);
    expect(screen.getByRole('button', { name: 'Remove filter Status' })).toBeInTheDocument();
  });
});

describe('Banner (A2)', () => {
  it('error is role=alert with an icon and words and an action', () => {
    render(<Banner tone="error" title="The list did not load" action={{ label: 'Try again', onPress: () => {} }}>Check your network, then try again.</Banner>);
    const alert = screen.getByRole('alert');
    expect(alert.querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
  it('info is role=status', () => {
    render(<Banner tone="info">Rates updated</Banner>);
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'info');
  });
});

describe('Skeleton (S2)', () => {
  it('renders the requested row count and announces loading', () => {
    const { container } = render(<Skeleton rows={25} label="Loading loads" />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(25);
    expect(screen.getByRole('status', { name: 'Loading loads' })).toHaveAttribute('aria-busy', 'true');
  });
});

describe('Select (C4)', () => {
  it('empty shows the placeholder words flagged as placeholder, labelled by the field label', () => {
    render(<Select label="Status" placeholder="Any status" items={[{ id: 'a', label: 'Active' }]} emptyText="No options" />);
    expect(screen.getByText('Any status')).toHaveAttribute('data-placeholder');
    expect(screen.getByRole('button', { name: /Status/ })).toBeInTheDocument();
  });
});
