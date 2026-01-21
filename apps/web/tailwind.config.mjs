/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ベース
        base: "#fafafa", // 全体背景
        card: "#ffffff", // カード背景

        // あなたのアクセント
        accent1: "#BF8641", // メインアクセント

        // 状態色
        correct: "#2f9e44", // 正解（落ち着いたグリーン）
        wrong: "#d94848", // 不正解（強すぎないレッド）

        // サブテキスト
        hint: "#6b7280", // gray-500相当
      },
    },
  },
  plugins: [],
};
