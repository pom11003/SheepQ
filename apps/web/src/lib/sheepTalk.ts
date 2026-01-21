export const SHEEP_TALK = {
    intro: "🐑 ひつじ博士からの挑戦！",
    correct: [
        "🐑 メェ〜！大正解！",
        "🐑 さすが！羊博士だね！",
        "🐑 その調子メェ〜！",
    ],
    wrong: [
        "🐑 メェ…おしい！",
        "🐑 ちがったみたい…次はいけるよ！",
        "🐑 もふもふは奥が深い…",
    ],
    resultTitle: "🐑 羊クイズの結果発表！",
};

export const pickRandom = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
