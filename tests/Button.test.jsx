import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/index.js';

describe('Button', () => {
  it('busy keeps the label in the DOM (hidden, so the width holds) and shows a named progress indicator (A1)', () => {
    render(<Button isBusy busyLabel="Saving">Save changes</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('data-pending');
    const label = screen.getByText('Save changes');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('data-hidden');
    expect(screen.getByRole('progressbar', { name: 'Saving' })).toBeInTheDocument();
  });
  it('not busy: no progress indicator and the label is visible', () => {
    render(<Button>Save changes</Button>);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(screen.getByText('Save changes')).not.toHaveAttribute('data-hidden');
  });
  it('variants are exposed for the visual gates', () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'danger');
  });
});
