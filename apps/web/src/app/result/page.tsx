"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const correct = Number(searchParams.get("correct") ?? 0);

    // ✅ 正解数に応じた羊コメント
    const comment =
        correct === 5
            ? "🐑 完璧メェ〜！あなたはひつじ博士！"
            : correct >= 3
                ? "🐑 なかなかやるね！もふもふ上級者！"
                : correct >= 1
                    ? "🐑 おしいメェ…！次はもっといける！"
                    : "🐑 メェ…0点！？でも挑戦しただけでえらい！";

    return (
        <div style={{ padding: 20 }}>
            <h1>🐑 羊クイズの結果発表！</h1>

            <p>
                正解数：<strong>{correct}</strong> / 5 問
            </p>

            {/* ✅ コメント表示 */}
            <p style={{ marginTop: 12, fontWeight: "bold" }}>{comment}</p>

            {/* 羊イラスト用スペース（必要なら残す） */}
            <div
                style={{
                    width: 160,
                    height: 160,
                    border: "2px dashed #ccc",
                    borderRadius: 12,
                    margin: "16px auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                }}
            >
                羊イラスト予定
            </div>

            <button onClick={() => router.push("/quiz")}>もう一度挑戦</button>
        </div>
    );
}
