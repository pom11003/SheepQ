'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { HeroCard } from '@/components/HeroCard';
import AuthEntry from '@/components/AuthEntry';
import AppHeader from '@/components/AppHeader';

type Role = 'user' | 'admin';

type LoginResponse = {
  token?: string;
  user?: { id: number; email: string; role: Role };
  message?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export default function Home() {
  const router = useRouter();

  const [showAuth, setShowAuth] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [me, setMe] = useState<null | {
    id: number;
    email: string;
    role: Role;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const isLoggedIn = useMemo(() => !!me, [me]);

  useEffect(() => {
    // 起動時にローカル保存から復元
    try {
      const raw = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (raw && token) setMe(JSON.parse(raw));
    } catch {
      // noop
    }
  }, []);

  const openLogin = () => {
    setMode('login');
    setErrorMsg('');
    setShowAuth(true);
  };

  const openSignup = () => {
    setMode('signup');
    setErrorMsg('');
    setShowAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMe(null);
  };

  const goStart = () => {
    // ゲストで遊べる：未ログインでも /quiz に進める
    router.push('/quiz');
  };

  const afterLoginNavigate = (role: Role) => {
    // admin は管理画面へ、user は TOP に戻す
    if (role === 'admin') router.push('/admin');
    else router.push('/');
  };

  const submit = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      if (!email.trim() || !password) {
        setErrorMsg('メールアドレスとパスワードを入力してください');
        return;
      }

      if (mode === 'signup') {
        // signup: { user: { email, password } } 形式（Rails実装に合わせてる）
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ user: { email: email.trim(), password } }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setErrorMsg(
            data?.errors?.join?.('\n') ?? data?.message ?? '登録に失敗しました',
          );
          return;
        }

        // 登録後はそのままログインさせる（UX良い）
        setMode('login');
      }

      // login: { email, password } 形式（あなたのRails実装に合わせてる）
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await res.json().catch(() => null)) as LoginResponse | null;

      if (!res.ok || !data?.token || !data?.user) {
        setErrorMsg(data?.message ?? 'ログインに失敗しました');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setMe(data.user);
      setShowAuth(false);

      afterLoginNavigate(data.user.role);
    } catch (e) {
      setErrorMsg('通信に失敗しました（APIが起動しているか確認してね）');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base relative">
      {/* 共通ヘッダー */}
      <AppHeader />

      {/* 右上：ログイン状態表示 */}
      <div className="fixed right-4 top-4 z-20">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow backdrop-blur">
            <span className="max-w-[220px] truncate text-xs text-hint">
              {me?.email}（{me?.role}）
            </span>
            <button
              onClick={logout}
              type="button"
              className="rounded-full px-3 py-1 text-sm font-medium hover:bg-black/5"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <AuthEntry onOpenSignup={openSignup} onOpenLogin={openLogin} />
        )}
      </div>

      {/* Resultと同じ幅・同じ開始位置 */}
      <div className="mx-auto max-w-xl px-4">
        <div className="mt-6">
          <HeroCard onStart={goStart} onOpenLogin={openLogin} />
        </div>
      </div>

      {/* ログイン / 新規登録モーダル */}
      <AuthModal
        open={showAuth}
        mode={mode}
        setMode={setMode}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        loading={loading}
        onSubmit={submit}
        onClose={() => setShowAuth(false)}
      />
    </main>
  );
}
