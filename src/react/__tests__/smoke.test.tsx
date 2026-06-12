import { render, screen } from '@testing-library/react';
import { test, expect } from 'bun:test';

test('react testing toolchain works', () => {
  render(<div data-testid="probe">poko</div>);
  expect(screen.getByTestId('probe')).toHaveTextContent('poko');
});
