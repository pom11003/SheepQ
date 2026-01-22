import AppHeader from "@/components/AppHeader";
import Link from "next/link";

type PageProps = {
  searchParams?: Promise<{
    score?: string;
    total?: string;
  }>;
};

export default async function ResultPage({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const score = Number(sp.score ?? 0);
  const total = Number(sp.total ?? 0);

  const safeScore = Number.isFinite(score) ? score : 0;
  const safeTotal = Number.isFinite(total) ? total : 0;

  const rate = safeTotal > 0 ? Math.round((safeScore / safeTotal) * 100) : 0;

  const message =
    safeTotal === 0
      ? "結果を受け取れませんでした… 🐑"
      : rate === 100
        ? "もう完全に羊です 🐏🏆"
        : rate >= 70
          ? "もう半分、羊ですね 🐏✨"
          : rate >= 40
            ? "羊と人間のハーフくらい 🐑"
            : "まずはメェーから覚えよう 🐏📚";

  return (
    <main className="min-h-screen bg-base py-5">
      {/* 共通ヘッダー（確認なし） */}
      <AppHeader />

      <div className="mx-auto max-w-xl px-4">
        {/* Result タイトル */}
        <header className="text-center mt-6">
          <h2 className="text-3xl font-bold">結果</h2>
        </header>

        <section className="mt-8 rounded-2xl border bg-white/50 p-6 text-center shadow-sm">
          {/* 評価メッセージ（ここが主役） */}
          <p className="mb-4 text-xl font-bold">{message}</p>

          <p className="text-lg font-semibold">
            あなたは{" "}
            <span className="text-accent1 text-2xl font-bold">{safeScore}</span>{" "}
            / {safeTotal} 匹ゲット！
          </p>

          <p className="mt-2 text-sm text-gray-500">正答率：{rate}%</p>

          <div className="mt-5 text-3xl leading-relaxed">
            {Array.from({ length: safeScore }).map((_, i) => (
              <span key={i}>🐏</span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/quiz"
              className="rounded-sm bg-accent1 px-4 py-3 text-sm font-bold text-base hover:opacity-90"
            >
              もう1回やる
            </Link>

            <Link
              href="/"
              className="rounded-sm bg-base border px-4 py-3 text-sm font-bold hover:opacity-70"
            >
              TOPへ戻る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// "use client";

// import { useSearchParams, useRouter } from "next/navigation";

// export default function ResultPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     const correct = Number(searchParams.get("correct") ?? 0);

//     // ✅ 正解数に応じた羊コメント
//     const comment =
//         correct === 5
//             ? "🐑 完璧メェ〜！あなたはひつじ博士！"
//             : correct >= 3
//                 ? "🐑 なかなかやるね！もふもふ上級者！"
//                 : correct >= 1
//                     ? "🐑 おしいメェ…！次はもっといける！"
//                     : "🐑 メェ…0点！？でも挑戦しただけでえらい！";

//     return (
//         <div style={{ padding: 20 }}>
//             <h1>🐑 羊クイズの結果発表！</h1>

//             <p>
//                 正解数：<strong>{correct}</strong> / 5 問
//             </p>

//             {/* ✅ コメント表示 */}
//             <p style={{ marginTop: 12, fontWeight: "bold" }}>{comment}</p>

//             {/* 羊イラスト用スペース（必要なら残す） */}
//             <div
//                 style={{
//                     width: 160,
//                     height: 160,
//                     border: "2px dashed #ccc",
//                     borderRadius: 12,
//                     margin: "16px auto",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "#999",
//                 }}
//             >
//                 羊イラスト予定
//             </div>

//             <button onClick={() => router.push("/quiz")}>もう一度挑戦</button>
//         </div>
//     );
// }
