'use client';

import { useRouter } from 'next/navigation';

type AuthStatusProps = {
  me: { email: string; role: 'user' | 'admin' };
  onLogout: () => void;
};

export default function AuthStatus({ me, onLogout }: AuthStatusProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 my-5 shadow backdrop-blur">
      {me.role === 'admin' && (
        <button
          onClick={() => router.push('/admin')}
          className="rounded-full px-3 py-1 text-sm font-semibold text-accent1 hover:bg-black/5"
        >
          管理画面
        </button>
      )}

      <button
        onClick={onLogout}
        type="button"
        className="rounded-full px-3 py-1 text-sm font-medium hover:bg-black/5"
      >
        ログアウト
      </button>
    </div>
  );
}
