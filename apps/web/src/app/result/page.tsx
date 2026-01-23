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
    <main className="min-h-screen bg-base">
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
          <p className="mt-3 py-8 text-lg font-bold leading-relaxed">
            {message}
          </p>

          {/* スコア */}
          <p className="my-5-5 text-hint font-semibold">
            あなたは{" "}
            <span className="text-accent1 text-3xl font-bold tabular-nums">
              {safeScore}
            </span>{" "}
            <span className="text-hint">/ {safeTotal}</span> 匹ゲット！
          </p>

          <p className="mt-2 text-sm text-gray-500">正答率：{rate}%</p>

          {/* 羊 */}
          <div className="mt-10 text-3xl leading-relaxed">
            {Array.from({ length: safeScore }).map((_, i) => (
              <span key={i}>🐏</span>
            ))}
          </div>

          <div className="mt-5 pb-10 mx-10 grid gap-3">
            <Link
              href="/quiz"
              className="rounded-2xl bg-accent1 mt-10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.99]"
            >
              もう1回やる
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-gray-200 shadow-sm bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 active:scale-[0.99]"
            >
              TOPへ戻る
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
