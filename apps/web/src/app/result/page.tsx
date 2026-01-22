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
        ? "もう完全に羊ですね 🐏🏆"
        : rate >= 70
          ? "もう半分、羊ですね 🐏✨"
          : rate >= 40
            ? "羊と人間のハーフくらい 🐑"
            : "まずはメェーから覚えよう 🐏📚";

  return (
    <main className="min-h-screen bg-base py-5">
      <AppHeader />

      <div className="mx-auto max-w-xl px-4">
        <section className="mt-6 rounded-2xl bg-white p-6 sm:p-7 text-center shadow-sm">
          {/* タイトル（カード内に入れて統一） */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-accent1">
              結果
            </h2>
            <p className="text-sm text-hint">今回のスコアはこちらです 🐏</p>
          </div>

          <div className="mt-5 h-px w-full bg-black/5" />

          {/* 評価メッセージ */}
          <p className="mt-6 text-lg font-bold leading-relaxed">{message}</p>

          {/* スコア */}
          <p className="mt-5 text-base font-semibold">
            あなたは{" "}
            <span className="text-accent1 text-3xl font-bold tabular-nums">
              {safeScore}
            </span>{" "}
            <span className="text-hint">/ {safeTotal}</span> 匹ゲット！
          </p>

          <p className="mt-2 text-sm text-gray-500">正答率：{rate}%</p>

          {/* 羊 */}
          <div className="mt-5 text-3xl leading-relaxed">
            {Array.from({ length: safeScore }).map((_, i) => (
              <span key={i}>🐏</span>
            ))}
          </div>

          {/* ボタン */}
          <div className="mt-8 grid gap-3">
            <Link
              href="/quiz"
              className="rounded-xl bg-accent1 px-4 py-3 text-sm font-bold text-white hover:opacity-90"
            >
              もう1回やる
            </Link>

            <Link
              href="/"
              className="rounded-xl border bg-base px-4 py-3 text-sm font-bold hover:opacity-80"
            >
              TOPへ戻る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
