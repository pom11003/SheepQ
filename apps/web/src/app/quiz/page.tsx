"use client";

import { useEffect, useState } from "react";

type Choice = {
  id: number;
  quiz_id: number;
  text: string;
  is_correct: boolean;
  sort_order: number;
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

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3001/admin/quizzes", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = (await res.json()) as Quiz[];
        setQuizzes(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="p-6">読み込み中...</div>;
  if (error) return <div className="p-6 text-red-600">エラー: {error}</div>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">クイズ一覧（管理）</h1>

      {quizzes.length === 0 ? (
        <p>クイズがありません</p>
      ) : (
        <ul className="space-y-3">
          {quizzes.map((q) => (
            <li key={q.id} className="rounded border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="font-semibold">
                  #{q.id} {q.question}
                </div>

                {/* 🔽 Tailwindが確実に効く書き方 */}
                <span
                  className={[
                    "text-xs px-2 py-1 rounded border",
                    q.is_published ? "bg-green-50" : "bg-zinc-50",
                  ].join(" ")}
                >
                  {q.is_published ? "公開" : "非公開"}
                </span>
              </div>

              <ol className="mt-3 list-decimal pl-6 space-y-1">
                {q.choices
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((c) => (
                    <li key={c.id}>
                      {c.text} {c.is_correct ? "✅" : ""}
                    </li>
                  ))}
              </ol>

              {q.explanation && (
                <p className="mt-3 text-sm text-zinc-600">
                  解説: {q.explanation}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
