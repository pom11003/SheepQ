"use client";

type AuthEntryProps = {
  onOpenSignup: () => void;
  onOpenLogin: () => void;
};

export default function AuthEntry({
  onOpenSignup,
  onOpenLogin,
}: AuthEntryProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 my-5 shadow backdrop-blur">
      <button
        onClick={onOpenSignup}
        type="button"
        className="rounded-full px-3 py-1 text-sm font-medium hover:bg-black/5"
      >
        新規登録
      </button>
      <button
        onClick={onOpenLogin}
        type="button"
        className="rounded-full px-3 py-1 text-sm font-medium hover:bg-black/5"
      >
        ログイン
      </button>
    </div>
  );
}
