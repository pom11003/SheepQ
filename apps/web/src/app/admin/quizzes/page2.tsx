"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Choice = {
  id: number;
  quiz_id: number;
  text: string;
  is_correct: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type Quiz = {
  id: number;
  image_url: string | null;
  question: string;
  explanation: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  choices: Choice[];
};

type ChoiceDraft = {
  text: string;
  is_correct: boolean;
  sort_order: number;
};

const API_BASE = "http://localhost:3001";

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // form state
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");
  const [choices, setChoices] = useState<ChoiceDraft[]>([
    { sort_order: 1, text: "", is_correct: true },
    { sort_order: 2, text: "", is_correct: false },
    { sort_order: 3, text: "", is_correct: false },
    { sort_order: 4, text: "", is_correct: false },
  ]);

  const correctCount = useMemo(
    () => choices.filter((c) => c.is_correct).length,
    [choices]
  );

  const load = async () => {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/admin/quizzes`, { cache: "no-store" });
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = (await res.json()) as Quiz[];
      setQuizzes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    }
  };

  // ✅ 追加：公開/非公開切り替え（PATCH）
  const togglePublish = async (id: number, next: boolean) => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin/quizzes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_published: next }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PATCH failed: ${res.status}\n${text}`);
      }

      const updated = (await res.json()) as Quiz;

      // 一覧を更新（該当の1件だけ差し替え）
      setQuizzes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateChoiceText = (idx: number, text: string) => {
    setChoices((prev) => prev.map((c, i) => (i === idx ? { ...c, text } : c)));
  };

  const setCorrectIndex = (idx: number) => {
    // 「正解は1つ」運用にする（要件が「1つ以上」ならここを複数可に変えられる）
    setChoices((prev) => prev.map((c, i) => ({ ...c, is_correct: i === idx })));
  };

  const validate = (): string | null => {
    if (!question.trim()) return "問題文（question）は必須です。";
    const empty = choices.find((c) => !c.text.trim());
    if (empty) return "選択肢はすべて入力してください。";
    if (correctCount < 1) return "正解の選択肢が1つ以上必要です。";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ★重要：APIが期待していた形（トップレベル question + choices）
      const payloadObj = {
        question: question.trim(),
        explanation: explanation.trim() ? explanation.trim() : null,
        choices: choices.map((c) => ({
          sort_order: c.sort_order,
          text: c.text.trim(),
          is_correct: c.is_correct,
        })),
      };

      const res = await fetch(`${API_BASE}/admin/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadObj),
      });

      if (!res.ok) {
        // エラー本文を見やすくする
        const text = await res.text();
        throw new Error(`POST failed: ${res.status}\n${text}`);
      }

      // 作成されたquizが返ってくる前提（あなたのAPIは返ってきてました）
      const created = (await res.json()) as Quiz;

      // 先頭に追加（最新が上）
      setQuizzes((prev) => [created, ...prev]);

      // フォームをリセット
      setQuestion("");
      setExplanation("");
      setChoices([
        { sort_order: 1, text: "", is_correct: true },
        { sort_order: 2, text: "", is_correct: false },
        { sort_order: 3, text: "", is_correct: false },
        { sort_order: 4, text: "", is_correct: false },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Admin Quizzes
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              一覧 + 新規作成（POST） + 公開/非公開切替（PATCH）
            </p>
          </div>
          <div className="rounded-full bg-white px-3 py-1 text-sm text-zinc-700 shadow-sm ring-1 ring-zinc-200">
            {quizzes.length} 件
          </div>
        </header>

        {error && (
          <div className="whitespace-pre-wrap rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Create Form */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">新規作成</h2>

          <form className="mt-4 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-zinc-800">
                問題文（question）
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例：羊の英語はどれ？"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">
                解説（explanation）※任意
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="例：sheep が羊。goat はヤギ。"
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-800">
                  選択肢（choices）
                </label>
                <span className="text-xs text-zinc-500">
                  正解は 1つ選択（現在: {correctCount}）
                </span>
              </div>

              <div className="mt-2 space-y-2">
                {choices.map((c, idx) => (
                  <div
                    key={c.sort_order}
                    className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                  >
                    <span className="w-6 text-right text-xs text-zinc-500">
                      {c.sort_order}.
                    </span>

                    <input
                      className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      value={c.text}
                      onChange={(e) => updateChoiceText(idx, e.target.value)}
                      placeholder="選択肢テキスト"
                    />

                    <label className="flex items-center gap-2 text-xs text-zinc-700">
                      <input
                        type="radio"
                        name="correct"
                        checked={c.is_correct}
                        onChange={() => setCorrectIndex(idx)}
                      />
                      正解
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "作成中..." : "作成（POST）"}
            </button>
          </form>
        </section>

        {/* List */}
        <section className="space-y-4">
          {quizzes.map((q) => {
            const sortedChoices = q.choices
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order);

            return (
              <article
                key={q.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        #{q.id}
                      </span>

                      {q.is_published ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                          公開
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
                          非公開
                        </span>
                      )}

                      {/* ✅ 追加：公開/非公開 切替ボタン */}
                      <button
                        type="button"
                        onClick={() => togglePublish(q.id, !q.is_published)}
                        className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                      >
                        {q.is_published ? "非公開にする" : "公開にする"}
                      </button>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold leading-snug text-zinc-900">
                      {q.question}
                    </h3>

                    {q.explanation && (
                      <p className="mt-2 text-sm text-zinc-600">
                        {q.explanation}
                      </p>
                    )}
                  </div>

                  <time className="shrink-0 text-xs text-zinc-500">
                    {new Date(q.created_at).toLocaleString()}
                  </time>
                </div>

                <ol className="mt-4 space-y-2">
                  {sortedChoices.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 text-right text-xs text-zinc-500">
                          {c.sort_order}.
                        </span>
                        <span className="text-sm text-zinc-900">{c.text}</span>
                      </div>

                      {c.is_correct ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                          ✅ 正解
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400">　</span>
                      )}
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
