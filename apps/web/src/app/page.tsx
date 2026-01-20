"use client";

import { useState } from "react";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!answer.trim()) {
      setError("回答を入力してください");
      return;
    }

    try {
      const res = await fetch("/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      });

      if (!res.ok) {
        throw new Error("送信失敗");
      }

      // ✅ 成功時の処理
      setSuccess("送信しました！");
      setAnswer(""); // 入力欄を空に戻す
    } catch (e) {
      setError("スコアの送信に失敗しました");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="w-full max-w-3xl rounded-xl bg-white p-10 shadow">
        <h1 className="text-2xl font-bold">SheepQ（仮）回答フォーム</h1>

        <p className="mt-2 text-sm text-zinc-600">
          回答を入力して送信してください（B担当：未入力チェック・エラー表示・入力制限）
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium">回答</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            maxLength={100}
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="例：ひつじ"
          />
          <div className="mt-1 text-right text-xs text-zinc-500">
            {answer.length}/100
          </div>
        </div>

        {/* エラー表示 */}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {/* 成功表示 */}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full rounded-full bg-black py-3 text-white hover:bg-zinc-800"
        >
          送信
        </button>
      </main>
    </div>
  );
}
