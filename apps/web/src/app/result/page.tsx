type ResultProps = {
  score: number; // 正解数
  total: number; // 全問題数
};

export default function Result({ score, total }: ResultProps) {
  return (
    <div className="text-center mt-16">
      <h1 className="text-3xl font-bold mb-4">Result</h1>

      <p className="text-xl mb-4">
        あなたは {score} / {total} 匹ゲット！
      </p>

      {/*----- 🐏をスコア分だけ並べる -----*/}
      {/* ① score = 5 のとき、長さ5の配列を作る [ _, _, _, _, _ ] */}
      {/* ② それを map で回して、<span>🐏</span>を5回表示している。 */}
      <div className="text-3xl mb-6">
        {Array.from({ length: score }).map((_, i) => (
          <span key={i}>🐏</span>
        ))}
      </div>

      <button className="px-4 py-2 border rounded">もう一回やる</button>
    </div>
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
