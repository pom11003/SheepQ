//----- Quiz配列の10問雛形 -----//
// 中身は入れ替えられます

export type Quiz = {
  id: number;
  question: string;
  imageUrl?: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

export const quizzes: Quiz[] = [
  {
    id: 1,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep01.jpg",
    choices: ["羊", "山羊", "犬", "牛"],
    correctIndex: 0,
    explanation: "羊は毛が特徴で、群れで行動することが多い動物です。",
  },
  {
    id: 2,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep02.jpg",
    choices: ["鹿", "羊", "馬", "猫"],
    correctIndex: 1,
    explanation: "羊は反芻（はんすう）して食べ物を消化します。",
  },
  {
    id: 3,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep03.jpg",
    choices: ["山羊", "羊", "アルパカ", "犬"],
    correctIndex: 1,
    explanation: "羊と山羊は似ていますが、顔つきや角・毛の印象が違います。",
  },
  {
    id: 4,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep04.jpg",
    choices: ["羊", "豚", "牛", "狼"],
    correctIndex: 0,
    explanation: "羊は家畜として世界中で飼育されています。",
  },
  {
    id: 5,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep05.jpg",
    choices: ["犬", "羊", "熊", "猫"],
    correctIndex: 1,
    explanation: "羊の毛はウールとして衣類などに使われます。",
  },
  {
    id: 6,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep06.jpg",
    choices: ["羊", "山羊", "狐", "馬"],
    correctIndex: 0,
    explanation: "羊は草食で、牧草地で暮らすことが多いです。",
  },
  {
    id: 7,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep07.jpg",
    choices: ["牛", "犬", "羊", "鹿"],
    correctIndex: 2,
    explanation: "羊は群れで行動する習性が強いです。",
  },
  {
    id: 8,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep08.jpg",
    choices: ["羊", "山羊", "猫", "虎"],
    correctIndex: 0,
    explanation: "羊は温厚な性格の個体が多いと言われます。",
  },
  {
    id: 9,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep09.jpg",
    choices: ["狼", "羊", "犬", "狸"],
    correctIndex: 1,
    explanation: "羊はウールや肉など、さまざまな形で人の生活に関わっています。",
  },
  {
    id: 10,
    question: "この動物はなに？",
    imageUrl: "/images/quizzes/sheep10.jpg",
    choices: ["羊", "牛", "山羊", "馬"],
    correctIndex: 0,
    explanation: "羊は品種によって毛や顔つきがかなり違います。",
  },
];
