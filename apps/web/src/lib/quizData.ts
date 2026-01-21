// クイズ1問の型（設計図）
export type QuizItem = {
    id: number;
    question: string;
    choices: string[];
    answerIndex: number;
};

// クイズ全体（5問）
export const QUIZ: QuizItem[] = [
    {
        id: 1,
        question: "🐑 Q1. 羊の英語はどれ？",
        choices: ["sheep", "goat", "cow", "horse"],
        answerIndex: 0,
    },
    {
        id: 2,
        question: "🐑 Q2. 羊の毛は何て呼ぶ？",
        choices: ["ウール", "シルク", "レザー", "リネン"],
        answerIndex: 0,
    },
    {
        id: 3,
        question: "🐑 Q3. 羊の鳴き声は？",
        choices: ["メェー", "モォー", "ニャー", "ワン"],
        answerIndex: 0,
    },
    {
        id: 4,
        question: "🐑 Q4. 羊がいる場所は？",
        choices: ["牧場", "港", "工場", "駅"],
        answerIndex: 0,
    },
    {
        id: 5,
        question: "🐑 Q5. 羊と関係が深い素材は？",
        choices: ["セーター", "ガラス", "鉄", "プラスチック"],
        answerIndex: 0,
    },
];
