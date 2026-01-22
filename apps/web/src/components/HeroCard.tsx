"use client";

export function HeroCard({
  onStart,
  onOpenLogin,
}: {
  onStart: () => void;
  onOpenLogin: () => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="pt-10 px-10 font-semibold whitespace-nowrap text-[clamp(18px,5vw,28px)]">
            ひつじの挑戦状 - SheepQ -
          </h1>
        </div>
      </div>

      <p className="px-10 mt-4 text-sm text-gray-600">
        ひつじに関するクイズに挑戦しよう！
        <br />
        クイズに正解してひつじをたくさん集めよう 🐑🐏
      </p>

      {/* 遊び方 */}
      <div className="mx-10 px-5 mt-10 rounded-2xl bg-gray-50 p-4 text-xs text-hint">
        <div className="font-semibold text-gray-700">遊び方</div>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>ランダムで10問出題されます</li>
          <li>回答すると正解と解説が表示されます</li>
          <li>スコアはひつじ換算です 🐏</li>
        </ul>
      </div>

      <div className="mt-5 pb-10 mx-10 grid gap-3">
        <button
          onClick={onStart}
          className="rounded-2xl bg-accent1 mt-10 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.99]"
          type="button"
        >
          ゲームスタート 🐏
        </button>

        <button
          onClick={onOpenLogin}
          className="rounded-2xl border bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50 active:scale-[0.99]"
          type="button"
        >
          ログインはこちら 🔐
        </button>
      </div>
    </section>
  );
}
