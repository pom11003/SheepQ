'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // 今は仮。APIができたらここを使う
    console.log(email, password);
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
        />

        <input
          className="input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="loginButton" onClick={handleLogin}>
          ログイン
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

        // card レイアウト共通 → 後でコンポーネント化しやすい
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
      `}</style>
    </main>
  );
}
