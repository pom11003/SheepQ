"use client";

export default function QuizPage() {
    const question = "Q1. ひつじの鳴き声は？（仮）";
    const choices = ["めー", "にゃー", "わん", "ぴよ"];

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
            <main className="w-full max-w-3xl rounded-xl bg-white p-10 shadow">
                <h1 className="text-2xl font-bold">SheepQ（仮）クイズ</h1>

                <p className="mt-6 text-lg font-semibold">{question}</p>

                <div className="mt-6 grid gap-3">
                    {choices.map((c) => (
                        <button
                            key={c}
                            type="button"
                            className="w-full rounded-lg border px-4 py-3 text-left hover:bg-zinc-50"
                            onClick={() => {
                                // まだ動かさなくてOK（雛形）
                                console.log("clicked:", c);
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-sm text-zinc-600">
                    ※ ここは雛形です（ボタンはまだ動きません）
                </div>
            </main>
        </div>
    );
}
