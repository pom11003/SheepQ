'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'user' | 'admin';

type LoginResponse = {
  message: string;
  token?: string;
  user?: { id: number; email: string; role: Role };
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      if (!email.trim() || !password) {
        setErrorMsg('メールアドレスとパスワードを入力してください');
        return;
      }

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
        setErrorMsg((data as any)?.message ?? 'ログインに失敗しました');
        return;
      }

      // admin 以外は管理画面に入れない（最短のガード）
      if (data.user.role !== 'admin') {
        setErrorMsg('管理者アカウントではありません');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/admin/quizzes');
    } catch {
      setErrorMsg('通信に失敗しました（APIが起動しているか確認してね）');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="card">
        <h1 className="title">🐑 管理者ログイン</h1>
        <p className="subtitle">ひつじの世界を管理します</p>

        <input
          className="input"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button
          className="loginButton"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom, #cceeff, #e6f7d9);
        }

        /* card レイアウト共通 → 後でコンポーネント化しやすい */
        .card {
          background: white;
          padding: 48px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 360px;
        }

        .title {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 14px;
          color: #777;
          margin-bottom: 24px;
        }

        .input {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 12px;
          border: 1px solid #ddd;
          font-size: 14px;
        }

        .error {
          margin: 0 0 12px;
          font-size: 13px;
          color: #d33;
          white-space: pre-wrap;
        }

        .loginButton {
          width: 100%;
          padding: 12px;
          border-radius: 999px;
          border: none;
          background-color: #ffcc66;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 0 #e6b84d;
        }

        .loginButton:hover {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #e6b84d;
        }

        .loginButton:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 0 #e6b84d;
        }
      `}</style>
    </main>
  );
}
