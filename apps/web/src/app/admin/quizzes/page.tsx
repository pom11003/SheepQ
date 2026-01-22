'use client';

import { useMemo, useState } from 'react';
import { quizzes as seedQuizzes } from '@/lib/quizzes';

type AdminQuiz = {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
  imageCredit?: string;
};

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function AdminQuizzesPage() {
  // まずは lib/quizzes を管理画面用に変換して仮表示
  const initial: AdminQuiz[] = useMemo(() => {
    return (seedQuizzes ?? []).map((q, i) => ({
      id: `seed-${i}`,
      question: q.question,
      choices: q.choices,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      imageUrl: q.imageUrl,
      imageCredit: q.imageCredit,
    }));
  }, []);

  const [items, setItems] = useState<AdminQuiz[]>(initial);

  // 追加フォーム（まずは最小限）
  const [question, setQuestion] = useState('');
  const [choicesText, setChoicesText] = useState('A\nB\nC\nD');
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState('');

  const choices = useMemo(() => {
    return choicesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }, [choicesText]);

  const canAdd =
    question.trim().length > 0 &&
    choices.length >= 2 &&
    correctIndex >= 0 &&
    correctIndex < choices.length;

  const onAdd = () => {
    if (!canAdd) return;

    const newQuiz: AdminQuiz = {
      id: uid(),
      question: question.trim(),
      choices,
      correctIndex,
      explanation: explanation.trim(),
    };

    setItems((prev) => [newQuiz, ...prev]);

    // フォーム初期化（最低限）
    setQuestion('');
    setExplanation('');
    setCorrectIndex(0);
    setChoicesText('A\nB\nC\nD');
  };

  const onRemove = (id: string) => {
    setItems((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <main className="min-h-screen bg-base py-6">
      {/* ヘッダー */}
      <header className="mx-auto max-w-5xl px-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-accent1">
              Admin / Quizzes
            </h1>
            <p className="mt-1 text-sm text-hint">
              クイズの追加・削除（まずはUI）。あとでAPIに差し替えます。
            </p>
          </div>

          <div className="rounded-full bg-white px-4 py-2 shadow-sm text-sm text-hint">
            合計{' '}
            <span className="font-semibold text-accent1">{items.length}</span>{' '}
            問
          </div>
        </div>
      </header>

      {/* コンテンツ */}
      <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 gap-6 px-4 lg:grid-cols-[420px_1fr]">
        {/* 追加フォーム */}
        <section className="rounded-2xl bg-card p-5 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-accent1">
            ＋ クイズを追加
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                問題文
              </label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例）羊の毛が伸び続ける理由は？"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                選択肢（改行区切り）
              </label>
              <textarea
                value={choicesText}
                onChange={(e) => setChoicesText(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
              />
              <p className="mt-1 text-xs text-hint">
                今は最低2個でOK（おすすめは4択）。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  正解番号
                </label>
                <select
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
                >
                  {choices.map((_, i) => (
                    <option key={i} value={i}>
                      {i + 1} 番目
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-xl border border-gray-100 bg-base px-3 py-2">
                <div className="text-xs text-hint">プレビュー</div>
                <div className="mt-1 text-sm font-medium">
                  {choices[correctIndex] ?? '—'}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">解説</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="例）羊は自然環境では…"
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
              />
            </div>

            <button
              type="button"
              onClick={onAdd}
              disabled={!canAdd}
              className={[
                'w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition',
                canAdd
                  ? 'bg-accent1 hover:opacity-90'
                  : 'bg-gray-300 cursor-not-allowed',
              ].join(' ')}
            >
              追加する
            </button>

            {!canAdd ? (
              <p className="text-xs text-hint">
                問題文 / 選択肢(2つ以上) / 正解番号 が揃うと追加できます。
              </p>
            ) : null}
          </div>
        </section>

        {/* 一覧 */}
        <section className="rounded-2xl bg-card p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-accent1">クイズ一覧</h2>
            <div className="text-xs text-hint">
              ※ いまはローカル状態（更新しても保存されません）
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {items.map((q, idx) => (
              <article
                key={q.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-hint">
                      #{idx + 1} / id: <span className="font-mono">{q.id}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold">
                      Q. {q.question}
                    </h3>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {q.choices.map((c, i) => {
                        const isAnswer = i === q.correctIndex;
                        return (
                          <div
                            key={i}
                            className={[
                              'rounded-xl border px-3 py-2 text-sm',
                              isAnswer
                                ? 'border-correct bg-correct/10'
                                : 'border-gray-200 bg-white',
                            ].join(' ')}
                          >
                            {c}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation ? (
                      <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
                        {q.explanation}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-hint">（解説なし）</p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span
                      className={[
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        'bg-accent1/10 text-accent1',
                      ].join(' ')}
                    >
                      正解: {q.correctIndex + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRemove(q.id)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {items.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-base p-10 text-center text-hint">
                まだクイズがありません。左のフォームから追加してね 🐑
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
