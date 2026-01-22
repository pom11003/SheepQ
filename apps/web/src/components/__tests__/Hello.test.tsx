import { render, screen } from '@testing-library/react';

function Hello({ name }: { name: string }) {
  return <h1>こんにちは、{name}</h1>;
}

describe('Hello', () => {
  it('名前を表示できる', () => {
    render(<Hello name="ひつじ" />);
    expect(
      screen.getByRole('heading', { name: 'こんにちは、ひつじ' }),
    ).toBeInTheDocument();
  });
});
