import { render, screen } from '@testing-library/react';
import AuthModal from '../components/AuthModal';

describe('AuthModal', () => {
  it('signupモードで表示できる', () => {
    render(
      <AuthModal
        open={true}
        onClose={() => {}}
        mode="signup"
        setMode={() => {}}
        email="test@example.com"
        setEmail={() => {}}
        password="password123"
        setPassword={() => {}}
        errorMsg="" // ← null ではなく空文字
        setErrorMsg={(_msg: string) => {}} // ← string を受け取る
        loading={false}
        onSubmit={async () => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: '新規登録' }),
    ).toBeInTheDocument();
  });
});
