"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { quizzes } from "@/lib/quizzes";
import AppHeader from "@/components/AppHeader";

//----- シャッフル関数 -----//
function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizPage() {
  const router = useRouter();

  // ----- ランダム10問を最初に固定する -----//
  const PICK_COUNT = 10;

  const [questions] = useState(() => {
    const n = Math.min(PICK_COUNT, quizzes.length); // 問題数が10未満でも安全
    return shuffle(quizzes).slice(0, n);
  });

  // 今何問目？
  const [index, setIndex] = useState(0);

  // 回答状態
  const [selected, setSelected] = useState<number | null>(null); // ユーザーが選んだ選択肢の番号,まだ選んでない時は null
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // 正解だった？（true/false）

  // 合計スコア（正解数）
  const [score, setScore] = useState(0);

  // total：問題数（表示に使う）
  // quiz：今表示する1問
  const total = questions.length;
  const quiz = useMemo(() => questions[index], [questions, index]);

  // 「回答済みか」を判定
  const answered = selected !== null;

  // onChoose :ユーザーが1つの選択肢を押した瞬間に起こる一連の処理
  const onChoose = (choiceIndex: number) => {
    if (answered) return; // 連打防止

    setSelected(choiceIndex); // 「どれを選んだか」を記録

    // 正解か判定
    const correct = choiceIndex === quiz.correctIndex;
    setIsCorrect(correct);

    // 今の最新のスコア s を使って+1してね
    if (correct) setScore((s) => s + 1);
  };

  const onNext = () => {
    // 次へ
    const nextIndex = index + 1;

    // 状態リセット
    setSelected(null);
    setIsCorrect(null);

    // まだ問題が残ってたら setIndex(nextIndex) して次の問題へ
    if (nextIndex < total) {
      setIndex(nextIndex);
      return;
    }

    // 最後なら結果へ（score と total をURLにつけて渡したい）
    // 念のため「今画面に出ているスコア」を使う（最終表示の値）
    const finalScore = score;

    router.push(`/result?score=${finalScore}&total=${total}`);
  };

  return (
    <main className="min-h-screen bg-base py-5">
      <AppHeader showConfirm />

      {/* クイズ画面用のサブ情報 */}
      <div className="mb-3 px-4 text-right text-lg text-hint">
        Q {index + 1} / {total}
      </div>

      {/* 中央寄せコンテンツ */}
      <div className="mx-auto max-w-xl px-4">
        {/* 画像（画像がある時だけ表示） */}
        {quiz.imageUrl ? (
          <div className="mb-4">
            {/* 表示枠：サイズと比率を固定 */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50 shadow-sm aspect-[4/3]">
              <Image
                src={quiz.imageUrl}
                alt="quiz"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 640px"
                className="object-cover object-center"
              />

              {/* 右下にクレジットを重ねて表示 */}
              {quiz.imageCredit && (
                <div className="absolute bottom-1 right-2 rounded bg-black/50 px-1 text-[10px] text-white">
                  {quiz.imageCredit}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* 問題 */}
        <h2 className="mb-4 text-lg font-medium">Q. {quiz.question}</h2>

        {/* 回答エリア（選択肢カード） */}
        <section className="mt-3 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3">
            {quiz.choices.map((label, i) => {
              const isSelected = selected === i;
              const isAnswer = quiz.correctIndex === i;

              const base =
                "rounded-xl border px-3 py-3 text-sm transition active:scale-[0.99]";
              const enabled = "hover:bg-gray-50";
              const disabled = "opacity-80";

              let stateClass = "";

              if (answered) {
                if (isAnswer)
                  stateClass = "border-correct bg-correct/10"; // 正解は緑
                else if (isSelected)
                  stateClass = "border-wrong bg-wrong/10"; // 間違えて選んだのは赤
                else stateClass = "border-gray-200 bg-white"; // その他は普通
              } else {
                stateClass = "border-gray-200 bg-white";
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChoose(i)}
                  disabled={answered} // 回答後はクリックできないようにする
                  className={[
                    base,
                    stateClass,
                    answered ? disabled : enabled,
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 回答後エリア（解説エリアは回答後だけ表示） */}
        {answered ? (
          <section
            className={[
              "mt-5 rounded-2xl bg-white p-4 border transition-colors",
              "motion-safe:animate-[fadeUp_300ms_ease-out]",
              isCorrect
                ? "border-correct/40 bg-correct/5"
                : "border-wrong/40 bg-wrong/5",
            ].join(" ")}
          >
            <div className="text-sm font-semibold">
              {isCorrect ? "✅ 正解！ +1 sheep 🐑" : "❌ 残念！"}
            </div>
            <div className="mt-2 text-sm font-medium">
              正解：{quiz.choices[quiz.correctIndex]}
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
              {quiz.explanation}
            </p>

            <div className="mt-4 flex items-center justify-end">
              <button
                type="button"
                onClick={onNext}
                className="rounded-sm bg-accent1 px-6 py-2 font-medium text-sm text-white hover:opacity-90"
              >
                次へ
              </button>
            </div>
          </section>
        ) : null}
      </div>
      {/* 画面下固定のスコアバー */}
      <div className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center gap-2 px-6 py-4 rounded-full bg-white/50 shadow text-lg font-bold text-accent1">
          <span>Score:</span>
          <span>{score}</span>
          <span className="whitespace-nowrap">sheep</span>
          <span className="whitespace-nowrap">
            {Array.from({ length: score }).map((_, i) => (
              <span key={i}>🐏</span>
            ))}
          </span>
        </div>
      </div>
    </main>
  );
}
