"use client";

import Link from "next/link";

type AppHeaderProps = {
  showConfirm?: boolean; // クイズ中だけ確認を出したい
};

export default function AppHeader({ showConfirm = false }: AppHeaderProps) {
  return (
    <header className="mb-4 flex items-center px-4">
      <h1 className="text-2xl font-semibold text-accent1">
        <Link
          href="/"
          onClick={(e) => {
            if (showConfirm) {
              if (!confirm("クイズを終了してHomeに戻りますか？")) {
                e.preventDefault();
              }
            }
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Sheep Q
        </Link>
      </h1>
    </header>
  );
}
