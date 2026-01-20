/** @type {import("prettier").Config} */
module.exports = {
  semi: true, // 文末にセミコロンを付ける
  singleQuote: true, // シングルクォート統一
  trailingComma: "all", // 末尾カンマを付ける（差分が綺麗）
  printWidth: 80, // 1行の最大文字数
  tabWidth: 2, // インデント2スペース
  arrowParens: "always", // アロー関数の引数に必ずカッコ
};
