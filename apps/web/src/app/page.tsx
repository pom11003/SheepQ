'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Role = 'user' | 'admin';

type LoginResponse = {
  message: string;
  token: string;
  user: { id: number; email: string; role: Role };
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
    if (role === 'admin') router.push('/admin/quizzes');
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

      if (!res.ok || !data?.token) {
        setErrorMsg((data as any)?.message ?? 'ログインに失敗しました');
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
    <main className="container">
      {/* 右上：ログイン状態表示 */}
      <div className="topRight">
        {isLoggedIn ? (
          <div className="meBox">
            <span className="meText">
              {me?.email}（{me?.role}）
            </span>
            <button className="ghostBtn" onClick={logout}>
              ログアウト
            </button>
          </div>
        ) : (
          <div className="meBox">
            <button className="ghostBtn" onClick={openSignup}>
              新規登録
            </button>
            <button className="ghostBtn" onClick={openLogin}>
              ログイン
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h1 className="title">🐏 ひつじの挑戦状</h1>
        <p className="subtitle">～ Sheep Q ～</p>

        <p className="description">ひつじに関するクイズに挑戦しよう！</p>

        <div className="buttons">
          <button className="startButton" onClick={goStart}>
            🐑 ゲームスタート
          </button>

          {/* admin導線（同じログインフォームでOK） */}
          <button
            className="adminButton"
            onClick={() => {
              openLogin();
            }}
            title="管理者もここからログイン"
          >
            🐑 管理者
          </button>
        </div>
      </div>

      {/* ログイン / 新規登録モーダル */}
      {showAuth && (
        <div className="modalOverlay" onClick={() => setShowAuth(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="tabs">
                <button
                  className={mode === 'login' ? 'tab active' : 'tab'}
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                >
                  ログイン
                </button>
                <button
                  className={mode === 'signup' ? 'tab active' : 'tab'}
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg('');
                  }}
                >
                  新規登録
                </button>
              </div>
              <button className="closeBtn" onClick={() => setShowAuth(false)}>
                ✕
              </button>
            </div>

            <div className="form">
              <label className="label">
                メール
                <input
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@example.com"
                  autoComplete="email"
                />
              </label>

              <label className="label">
                パスワード
                <input
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="password"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                />
              </label>

              {errorMsg && <p className="error">{errorMsg}</p>}

              <button
                className="primaryBtn"
                onClick={submit}
                disabled={loading}
              >
                {loading
                  ? '送信中...'
                  : mode === 'signup'
                    ? '登録してログインへ'
                    : 'ログイン'}
              </button>

              <p className="hint">
                ※ 管理者も同じフォームでログインできます（role が admin
                なら自動で /admin/quizzes へ）
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          position: relative;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to bottom, #cceeff, #e6f7d9);
          padding: 24px;
        }

        .topRight {
          position: absolute;
          top: 16px;
          right: 16px;
        }

        .meBox {
          display: flex;
          gap: 10px;
          align-items: center;
          background: #ffffffaa;
          padding: 8px 10px;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(6px);
        }

        .meText {
          font-size: 12px;
          color: #444;
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ghostBtn {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          padding: 6px 10px;
          border-radius: 999px;
          opacity: 0.9;
        }
        .ghostBtn:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .card {
          background: white;
          padding: 48px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 420px;
          width: 100%;
        }

        .title {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 18px;
          color: #666;
          margin-bottom: 24px;
        }

        .description {
          margin-bottom: 28px;
          color: #555;
        }

        .buttons {
          display: grid;
          gap: 12px;
          justify-items: center;
        }

        .startButton {
          font-size: 18px;
          padding: 12px 28px;
          border-radius: 999px;
          border: none;
          background-color: #ffcc66;
          cursor: pointer;
          box-shadow: 0 4px 0 #e6b84d;
          width: 100%;
          max-width: 260px;
        }

        .startButton:hover {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #e6b84d;
        }

        .adminButton {
          border: none;
          background: #f2f2f2;
          cursor: pointer;
          padding: 10px 16px;
          border-radius: 999px;
          opacity: 0.9;
        }
        .adminButton:hover {
          opacity: 1;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          z-index: 50;
        }

        .modal {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .modalHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 12px 0 12px;
        }

        .tabs {
          display: flex;
          gap: 8px;
        }
        .tab {
          border: none;
          background: #f2f2f2;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 13px;
        }
        .tab.active {
          background: #ffcc66;
        }

        .closeBtn {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
          padding: 6px 10px;
          border-radius: 10px;
        }
        .closeBtn:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .form {
          padding: 18px 18px 20px 18px;
          display: grid;
          gap: 12px;
        }

        .label {
          display: grid;
          gap: 6px;
          font-size: 12px;
          color: #444;
          text-align: left;
        }

        .input {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
        }
        .input:focus {
          border-color: #ffcc66;
          box-shadow: 0 0 0 3px rgba(255, 204, 102, 0.35);
        }

        .error {
          margin: 0;
          white-space: pre-line;
          color: #c0392b;
          background: rgba(192, 57, 43, 0.08);
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
        }

        .primaryBtn {
          border: none;
          border-radius: 14px;
          padding: 12px 14px;
          cursor: pointer;
          background: #ffcc66;
          box-shadow: 0 4px 0 #e6b84d;
          font-weight: 700;
        }
        .primaryBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .hint {
          margin: 0;
          color: #666;
          font-size: 12px;
        }
      `}</style>
    </main>
  );
}
