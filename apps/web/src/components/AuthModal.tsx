"use client";

import React, { useEffect } from "react";

type Mode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  mode: Mode;
  setMode: (mode: Mode) => void;

  email: string;
  setEmail: (v: string) => void;

  password: string;
  setPassword: (v: string) => void;

  errorMsg: string;
  setErrorMsg: (v: string) => void;

  loading: boolean;
  onSubmit: () => void;

  onClose: () => void;
};

export default function AuthModal({
  open,
  mode,
  setMode,
  email,
  setEmail,
  password,
  setPassword,
  errorMsg,
  setErrorMsg,
  loading,
  onSubmit,
  onClose,
}: AuthModalProps) {
  // ESCで閉じる（任意だけど便利）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const tabBase =
    "rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.99]";
  const tabActive = "bg-accent1/15 text-accent1";
  const tabIdle = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          "w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl",
          "motion-safe:animate-[fadeUp_300ms_ease-out]",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              className={[tabBase, mode === "login" ? tabActive : tabIdle].join(
                " ",
              )}
              onClick={() => {
                setMode("login");
                setErrorMsg("");
              }}
            >
              ログイン
            </button>

            <button
              type="button"
              className={[
                tabBase,
                mode === "signup" ? tabActive : tabIdle,
              ].join(" ")}
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
              }}
            >
              新規登録
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm hover:bg-black/5"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid gap-3 px-5 pb-6 pt-4">
          <label className="grid gap-1 text-xs font-medium text-gray-700">
            メール
            <input
              className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-accent1/60 focus:ring-4 focus:ring-accent1/15"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sheep@example.com"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-1 text-xs font-medium text-gray-700">
            パスワード
            <input
              className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-accent1/60 focus:ring-4 focus:ring-accent1/15"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
            />
          </label>

          {errorMsg && (
            <p className="whitespace-pre-line rounded-2xl border border-wrong/30 bg-wrong/10 px-4 py-3 text-sm text-wrong">
              {errorMsg}
            </p>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-2xl bg-accent1 mt-10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
          >
            {loading
              ? "送信中..."
              : mode === "signup"
                ? "登録してログイン"
                : "ログイン"}
          </button>

          {/* <p className="text-xs text-hint">
            ※ 管理者も同じフォームでログインできます（role が admin なら自動で
            /admin/quizzes へ）
          </p> */}

          {/* フッター：Score風バー */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 px-6 py-3text-sm font-bold text-accent1">
              <span>Ready</span>
              <span>to</span>
              <span>play?</span>
              <span className="whitespace-nowrap">🐏🐏🐏</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
