"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ } from "@/lib/quizData";

export default function QuizPage() {
    const router = useRouter();

    const [index, setIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [locked, setLocked] = useState(false);

    const item = QUIZ[index];
    const total = QUIZ.length; // 5

    const onSelect = (choiceIndex: number) => {
        if (locked) return;
        setLocked(true);

        const isCorrect = choiceIndex === item.answerIndex;
        if (isCorrect) setCorrectCount((c) => c + 1);
    };

    const onNext = () => {
        if (!locked) return;

        const nextIndex = index + 1;

        // ★ 5問終わったら結果発表へ
        if (nextIndex >= total) {
            router.push(`/result?correct=${correctCount}`);
            return;
        }

        setIndex(nextIndex);
        setLocked(false);
    };

    return (
        <div className="min-h-screen p-4 flex flex-col items-center bg-sky-50">
            {/* 🐑 イラストスペース */}
            <div className="w-48 h-48 mb-4 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                羊イラスト予定
            </div>

            <div className="w-full max-w-md">
                <p className="text-sm text-gray-600 mb-2">
                    Q{index + 1} / {total}
                </p>

                <h1 className="text-xl font-bold mb-4">{item.question}</h1>

                <div className="space-y-2">
                    {item.choices.map((c, i) => (
                        <button
                            key={c}
                            onClick={() => onSelect(i)}
                            disabled={locked}
                            className="w-full rounded-lg bg-white py-3 text-left px-4 shadow disabled:opacity-60"
                        >
                            {String.fromCharCode(65 + i)}. {c}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={!locked}
                    className="mt-6 w-full rounded-lg bg-orange-400 py-3 font-bold text-white disabled:opacity-50"
                >
                    次へ
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                    正解数：{correctCount} / {total}
                </p>
            </div>
        </div>
    );
}
