"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { quizzes } from "@/lib/quizzes";

export default function QuizPage() {
  const router = useRouter();

  // 今何問目？
  const [index, setIndex] = useState(0);

  // 回答状態
  const [selected, setSelected] = useState<number | null>(null); // ユーザーが選んだ選択肢の番号,まだ選んでない時は null
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // 正解だった？（true/false）

  // 合計スコア（正解数）
  const [score, setScore] = useState(0);

  // total：問題数（表示に使う）
  // quiz：今表示する1問
  const total = quizzes.length;
  const quiz = useMemo(() => quizzes[index], [index]); // useMemo は、「index が変わったときだけ、新しい quiz を取り直す」

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
    router.push(`/result?score=${score}&total=${total}`);
  };

  return (
    <main className="mx-auto max-w-xl bg-base px-4 py-8">
      {/* ヘッダー */}
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-accent1">Sheep Q</h1>

        <div className="text-sm text-gray-500">
          {index + 1} / {total}
        </div>
      </header>

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

      {/* 選択肢 */}
      {/* label：ボタンに表示する文字、i：その選択肢の番号（0〜3） */}
      <div className="grid grid-cols-2 gap-3">
        {quiz.choices.map((label, i) => {
          // 自分が選んだのは？
          const isSelected = selected === i;
          // 正解の選択肢は？
          const isAnswer = quiz.correctIndex === i;

          //----- 回答後の見た目 -----//
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
              className={[base, stateClass, answered ? disabled : enabled].join(
                " ",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 回答後エリア（解説エリアは回答後だけ表示） */}
      {answered ? (
        <section className="mt-5 rounded-2xl border bg-white p-4">
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
              className="rounded-xl bg-accent1 px-4 py-2 font-bold text-sm text-white hover:opacity-90"
            >
              次へ
            </button>
          </div>
        </section>
      ) : null}

      {/* 今のスコア */}
      <div className="mt-6 text-center font-bold text-sm text-accent1">
        スコア: {score} sheep 🐑
      </div>
    </main>
  );
}

// -------------------------------------- //

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { QUIZ } from "@/lib/quizData";

// export default function QuizPage() {
//   const router = useRouter();

//   const [index, setIndex] = useState(0);
//   const [correctCount, setCorrectCount] = useState(0);
//   const [locked, setLocked] = useState(false);

//   const item = QUIZ[index];
//   const total = QUIZ.length; // 5

//   const onSelect = (choiceIndex: number) => {
//     if (locked) return;
//     setLocked(true);

//     const isCorrect = choiceIndex === item.answerIndex;
//     if (isCorrect) setCorrectCount((c) => c + 1);
//   };

//   const onNext = () => {
//     if (!locked) return;

//     const nextIndex = index + 1;

//     // ★ 5問終わったら結果発表へ
//     if (nextIndex >= total) {
//       router.push(`/result?correct=${correctCount}`);
//       return;
//     }

//     setIndex(nextIndex);
//     setLocked(false);
//   };

//   return (
//     <div className="min-h-screen p-4 flex flex-col items-center bg-sky-50">
//       {/* 🐑 イラストスペース */}
//       <div className="w-48 h-48 mb-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
//         羊イラスト予定
//       </div>

//       <div className="w-full max-w-md">
//         <p className="text-sm text-gray-600 mb-2">
//           Q{index + 1} / {total}
//         </p>

//         <h1 className="text-xl font-bold mb-4">{item.question}</h1>

//         <div className="space-y-2">
//           {item.choices.map((c, i) => (
//             <button
//               key={c}
//               onClick={() => onSelect(i)}
//               disabled={locked}
//               className="w-full rounded-lg bg-white py-3 text-left px-4 shadow disabled:opacity-60"
//             >
//               {String.fromCharCode(65 + i)}. {c}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={onNext}
//           disabled={!locked}
//           className="mt-6 w-full rounded-lg bg-orange-400 py-3 font-bold text-white disabled:opacity-50"
//         >
//           次へ
//         </button>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           正解数：{correctCount} / {total}
//         </p>
//       </div>
//     </div>
//   );
// }
