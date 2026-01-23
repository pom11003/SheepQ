import { render, screen } from '@testing-library/react';
import { Hello } from '../Hello';

describe('Hello', () => {
  it('名前を表示できる', () => {
    render(<Hello name="ひつじ" />);
    expect(
      screen.getByRole('heading', { name: 'こんにちは、ひつじ' }),
    ).toBeInTheDocument();
  });
});
