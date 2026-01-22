'use client';

import { useEffect, useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import type React from 'react';

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

const API_BASE = 'http://localhost:3001';

export default function AdminQuizzesPage() {
  const [tab, setTab] = useState<'list' | 'create'>('list');

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // form state
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [choices, setChoices] = useState<ChoiceDraft[]>([
    { sort_order: 1, text: '', is_correct: true },
    { sort_order: 2, text: '', is_correct: false },
    { sort_order: 3, text: '', is_correct: false },
    { sort_order: 4, text: '', is_correct: false },
  ]);

  const correctCount = useMemo(
    () => choices.filter((c) => c.is_correct).length,
    [choices],
  );

  const load = async () => {
    try {
      setError('');
      const res = await fetch(`${API_BASE}/admin/quizzes`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`GET failed: ${res.status}`);
      const data = (await res.json()) as Quiz[];
      setQuizzes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown error');
    }
  };

  const togglePublish = async (id: number, next: boolean) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/admin/quizzes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: next }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PATCH failed: ${res.status}\n${text}`);
      }

      const updated = (await res.json()) as Quiz;
      setQuizzes((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown error');
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
    setChoices((prev) => prev.map((c, i) => ({ ...c, is_correct: i === idx })));
  };

  const validate = (): string | null => {
    if (!question.trim()) return '問題文（question）は必須です。';
    const empty = choices.find((c) => !c.text.trim());
    if (empty) return '選択肢はすべて入力してください。';
    if (correctCount < 1) return '正解の選択肢が1つ以上必要です。';
    return null;
  };

  const resetForm = () => {
    setQuestion('');
    setExplanation('');
    setChoices([
      { sort_order: 1, text: '', is_correct: true },
      { sort_order: 2, text: '', is_correct: false },
      { sort_order: 3, text: '', is_correct: false },
      { sort_order: 4, text: '', is_correct: false },
    ]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    setError('');

    try {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadObj),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST failed: ${res.status}\n${text}`);
      }

      const created = (await res.json()) as Quiz;
      setQuizzes((prev) => [created, ...prev]);
      resetForm();

      // ✅ 追加後は一覧へ戻す（運用がラク）
      setTab('list');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base ">
      <AppHeader />
      {/* 背景 */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(191,134,65,0.20) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent1/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent1/10 blur-2xl" />
        <div className="absolute top-1/3 right-10 h-56 w-56 rounded-full bg-correct/10 blur-2xl" />
      </div>

      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        {/* このページ固有の見出し（AppHeaderの下） */}
        <header className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-accent1">設定</h1>
                <p className="mt-1 text-sm text-hint">
                  ひつじの世界をかんりします🐏
                </p>
              </div>
            </div>

            <div className="self-start sm:self-auto">
              <div className="rounded-full bg-white/90 px-4 py-2 shadow-sm text-sm text-hint border border-gray-100">
                合計{' '}
                <span className="font-semibold text-accent1">
                  {quizzes.length}
                </span>{' '}
                問
              </div>
            </div>
          </div>
        </header>

        {/* コンテンツ */}
        <div className="mx-auto mt-10 max-w-5xl">
          {/* タブ */}
          {/* インデックス風タブ（カードと一体化） */}
          <div className="inline-flex overflow-hidden rounded-t-3xl bg-white ">
            <button
              type="button"
              onClick={() => setTab('list')}
              className={[
                'px-5 py-3 text-sm font-semibold transition',
                'border-r border-gray-100',
                tab === 'list'
                  ? 'bg-card text-accent1'
                  : 'bg-white text-hint hover:bg-gray-50',
              ].join(' ')}
              aria-current={tab === 'list' ? 'page' : undefined}
            >
              クイズ一覧
            </button>
            <button
              type="button"
              onClick={() => setTab('create')}
              className={[
                'px-5 py-3 text-sm font-semibold transition',
                tab === 'create'
                  ? 'bg-card text-accent1'
                  : 'bg-white text-hint hover:bg-gray-50',
              ].join(' ')}
              aria-current={tab === 'create' ? 'page' : undefined}
            >
              クイズ作成
            </button>
          </div>

          {tab === 'create' ? (
            //-----  クイズ追加フォーム -----//
            <section className="rounded-b-3xl bg-card p-5 shadow-sm border border-gray-100 border-t-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-accent1">
                  クイズ作成
                </h2>
                <span className="text-lg">🐏</span>
              </div>

              <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    問題文
                  </label>
                  <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例）羊の毛が伸び続ける理由は？"
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    解説（任意）
                  </label>
                  <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="例）羊は自然環境では…"
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent1/60"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      選択肢（4択）
                    </label>
                    <span className="text-xs text-hint">
                      正解は 1つ（現在: {correctCount}）
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    {choices.map((c, idx) => (
                      <div
                        key={c.sort_order}
                        className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-base px-3 py-2"
                      >
                        <span className="w-6 text-right text-xs text-hint">
                          {c.sort_order}.
                        </span>

                        <input
                          className="flex-1 rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm outline-none focus:border-accent1/60"
                          value={c.text}
                          onChange={(e) =>
                            updateChoiceText(idx, e.target.value)
                          }
                          placeholder="選択肢テキスト"
                        />

                        <label className="flex items-center gap-2 text-xs text-gray-700">
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

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setTab('list');
                    }}
                    className="rounded-2xl border border-gray-200 shadow-sm bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    キャンセル
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-2xl bg-accent1 shadow-sm px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? '作成中...' : '追加する'}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            //----- クイズ一覧 -----//
            <section className="rounded-b-3xl bg-card p-5 shadow-sm border border-gray-100 border-t-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-accent1">
                  クイズ一覧
                </h2>
                <button
                  type="button"
                  onClick={load}
                  className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  更新
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {quizzes.map((q) => {
                  const sortedChoices = q.choices
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order);

                  return (
                    <article
                      key={q.id}
                      className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-hint">
                            <span className="rounded-full bg-base px-2 py-1 border border-gray-100">
                              #{q.id}
                            </span>

                            <span
                              className={[
                                'ml-1 rounded-full px-2 py-1 text-[11px] font-semibold border',
                                q.is_published
                                  ? 'bg-correct/10 text-correct border-correct/20'
                                  : 'bg-gray-100 text-gray-600 border-gray-200',
                              ].join(' ')}
                            >
                              {q.is_published ? '公開' : '非公開'}
                            </span>
                          </div>

                          <h3 className="mt-2 text-sm font-semibold">
                            Q. {q.question}
                          </h3>

                          {q.explanation ? (
                            <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
                              {q.explanation}
                            </p>
                          ) : (
                            <p className="mt-3 text-sm text-hint">
                              （解説なし）
                            </p>
                          )}

                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {sortedChoices.map((c) => (
                              <div
                                key={c.id}
                                className={[
                                  'rounded-2xl border px-3 py-2 text-sm',
                                  c.is_correct
                                    ? 'border-correct bg-correct/10'
                                    : 'border-gray-200 bg-white',
                                ].join(' ')}
                              >
                                {c.sort_order}. {c.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => togglePublish(q.id, !q.is_published)}
                            className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            {q.is_published ? '非公開にする' : '公開にする'}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {quizzes.length === 0 ? (
                  <div className="rounded-3xl border border-gray-100 bg-base p-10 text-center text-hint">
                    まだクイズがありません。追加してね 🐑
                  </div>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
