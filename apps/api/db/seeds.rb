def normalize_explanation(s)
  return nil if s.nil?
  s.to_s.strip.gsub(/\A\n+|\n+\z/, "")
end

def seed_quiz!(q)
    raise "code is missing for quiz: #{q[:question]}" if q[:code].nil?

  # ✅ TSのidを code として一意扱い
  quiz = Quiz.find_or_initialize_by(code: q[:code])

  quiz.assign_attributes(
    question: q[:question],
    explanation: normalize_explanation(q[:explanation]),
    correct_index: q[:correct_index],
    image_url: q[:image_url],
    image_credit: q[:image_credit],
    is_published: true,
  )
  quiz.save!

  quiz.choices.destroy_all
  q[:choices].each_with_index do |text, i|
    Choice.create!(
      quiz_id: quiz.id,
      text: text,
      sort_order: i
    )
  end
end


SEED_QUIZZES = [
  # --- 品種クイズ ---
  {
    code: 1,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/shetland.jpg",
    image_credit: "© Tamas Tuzes-Katai / Unsplash",
    choices: ["メリノ（Merino）", "シェトランド（Shetland）", "テクセル（Texel）", "サフォーク（Suffolk）"],
    correct_index: 1,
    explanation: <<~TEXT
      スコットランド北部のシェトランド諸島原産の、小さくて愛らしい羊です。
      体は小柄ですが、とてもたくましく、厳しい寒さにも負けません。

      性格はおだやかで慎重。
      人の様子をよく観察する、賢くてやさしい羊として知られています。

      細かくて軽い羊毛は、高級ニットの定番素材です。
    TEXT
  },
  {
    code: 2,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/awassi.jpg",
    image_credit: "© Hữu Phú / Unsplash",
    choices: ["アワッシ（Awassi）", "ドーパー（Dorper）", "ロムニー（Romney）", "チェビオット（Cheviot）"],
    correct_index: 0,
    explanation: <<~TEXT
      中東の乾燥地帯で育ってきた、たくましい乳用羊です。
      長い耳と落ち着いた顔つきが印象的です。

      環境への適応力が高く、我慢強い性格が特徴です。
      人との距離を保ちながら、静かに仕事をこなすタイプの羊です。

      ミルクの質が良く、チーズ作りにも欠かせない存在です。
    TEXT
  },
  {
    code: 3,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/dorper.jpg",
    image_credit: "© AI Generated",
    choices: ["ドーパー（Dorper）", "サフォーク（Suffolk）", "テクセル（Texel）", "ハンプシャー（Hampshire）"],
    correct_index: 0,
    explanation: <<~TEXT
      南アフリカ原産の、暑さにも寒さにも強い羊です。
      白い体に黒い顔という、はっきりした配色が特徴です。

      性格はおだやかで扱いやすく、集団行動がとても上手です。
      農家からは「手のかからない、良い相棒」として愛されています。

      毛が自然に抜けるため、管理がしやすいのも魅力です。
    TEXT
  },
  {
    code: 4,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/eastfriesian.jpg",
    image_credit: "© Jael Coon / Unsplash",
    choices: ["イースト・フリージアン（East Friesian）", "アワッシ（Awassi）", "コリデール（Corriedale）", "リンカーン（Lincoln）"],
    correct_index: 0,
    explanation: <<~TEXT
      ドイツ原産の、世界を代表する乳用羊です。
      体が大きく、耳が長く、少し優しそうな顔立ちをしています。

      性格は比較的人なつっこく、好奇心が強いのが特徴です。
      人に近づいてくることも多く、牧場では人気者です。

      非常に多くのミルクを出す、働き者の羊です。
    TEXT
  },
  {
    code: 5,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/texel.jpg",
    image_credit: "© Ole Kloth / Unsplash",
    choices: ["テクセル（Texel）", "メリノ（Merino）", "サフォーク（Suffolk）", "ドーセット（Dorset）"],
    correct_index: 0,
    explanation: <<~TEXT
      オランダ原産の、がっしりとした体型の力強い羊です。
      筋肉質で、脚が太く、堂々とした立ち姿が印象的です。

      性格は落ち着いていて、群れの中でも安定感のある存在です。
      無駄に騒がず、静かに過ごす職人気質のような羊です。

      肉質の良さで、世界中から高く評価されています。
    TEXT
  },
  {
    code: 6,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/jacob.jpg",
    image_credit: "© AI Generated",
    choices: ["ジェイコブ（Jacob）", "ヴァレー・ブラックノーズ（Valais Blacknose）", "ブラックフェイス（Scottish Blackface）", "チェビオット（Cheviot）"],
    correct_index: 0,
    explanation: <<~TEXT
      白と黒のまだら模様と、複数の角を持つとても個性的な羊です。
      4本角の姿は、一度見たら忘れられません。

      性格は好奇心が強く、少し冒険好きな一面があります。
      見た目だけでなく、行動もユニークな魅力を持っています。

      観賞用としても世界中で愛されている品種です。
    TEXT
  },
  {
    code: 7,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/suffolk.jpg",
    image_credit: "© AI Generated",
    choices: ["サフォーク（Suffolk）", "ドーパー（Dorper）", "テクセル（Texel）", "ハンプシャー（Hampshire）"],
    correct_index: 0,
    explanation: <<~TEXT
      黒い顔と脚、白い体というコントラストが美しい羊です。
      イギリス原産で、写真クイズでも定番の品種です。

      性格はとてもおだやかで、人に慣れやすいのが特徴です。
      人のそばに寄ってくることも多く、初心者にも飼いやすい羊です。

      力強さとやさしさをあわせ持つ、バランスの良い品種です。
    TEXT
  },
  {
    code: 8,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/borderleicester.jpg",
    image_credit: "© AI Generated",
    choices: ["ボーダー・レスター（Border Leicester）", "ロムニー（Romney）", "リンカーン（Lincoln）", "コリデール（Corriedale）"],
    correct_index: 0,
    explanation: <<~TEXT
      イギリス原産の、耳が大きく優しい顔立ちの長毛種です。
      全体にのんびりとした雰囲気を持っています。

      性格は非常に温厚で、群れの中でも争いを起こしにくいタイプです。
      他の羊の世話役のような、落ち着いた存在になることもあります。

      交配用の親羊として、長く大切にされてきました。
    TEXT
  },
  {
    code: 9,
    question: "この羊の品種はなに？",
    image_url: "/images/quizzes/valais.jpg",
    image_credit: "© AI Generated",
    choices: ["ヴァレー・ブラックノーズ（Valais Blacknose）", "ジェイコブ（Jacob）", "ブラックフェイス（Scottish Blackface）", "サフォーク（Suffolk）"],
    correct_index: 0,
    explanation: <<~TEXT
      スイスの山岳地帯原産の、とても愛嬌のある羊です。
      黒い顔と白いふわふわの毛の組み合わせが大きな魅力です。

      性格はとても人なつっこく、好奇心旺盛です。
      人の近くに寄ってきて、じっと顔を見つめることもあります。

      「世界一かわいい羊」と呼ばれるのも納得の品種です。
    TEXT
  },

  # --- 基礎知識クイズ ---
  {
    code: 101,
    question: "この動物はなに？",
    image_url: "/images/quizzes/sheep03.jpg",
    image_credit: "© Tomas Trajan / Unsplash",
    choices: ["山羊", "羊", "アルパカ", "犬"],
    correct_index: 1,
    explanation: "羊と山羊は似ていますが、顔つきや角・毛の印象が違います。",
  },
  {
    code: 102,
    question: "この動物はなに？",
    image_url: "/images/quizzes/sheep05.jpg",
    image_credit: "© Thomas Bormans / Unsplash",
    choices: ["羊", "山羊", "猫", "虎"],
    correct_index: 0,
    explanation: "羊は温厚な性格の個体が多いと言われます。",
  },
  {
    code: 103,
    question: "この動物はなに？",
    image_url: "/images/quizzes/sheep04.jpg",
    image_credit: "© Livin4wheel / Unsplash",
    choices: ["羊", "牛", "山羊", "馬"],
    correct_index: 0,
    explanation: "羊は品種によって毛や顔つきがかなり違います。",
  },
  {
    code: 104,
    question: "羊のオスを英語で何と呼ぶ？",
    choices: ["Ewe", "Lamb", "Ram", "Sheep"],
    correct_index: 2,
    explanation: <<~TEXT
      オスの羊は「Ram」と呼ばれます。
      メスは「Ewe」、子どもは「Lamb」です。
    TEXT
  },
  {
    code: 105,
    question: "羊の胃はいくつある？",
    choices: ["1つ", "2つ", "3つ", "4つ"],
    correct_index: 3,
    explanation: <<~TEXT
      羊は4つの胃を持つ「反すう動物」です。
      これにより、草を効率よく消化できます。
    TEXT
  },
  {
    code: 106,
    question: "羊の視野は人間と比べてどうなっている？",
    choices: ["とても狭い", "ほぼ同じ", "とても広い", "前だけしか見えない"],
    correct_index: 2,
    explanation: <<~TEXT
      羊は左右に目がついているため、非常に広い視野を持っています。
      後ろ以外はほぼ見えると言われています。
    TEXT
  },
  {
    code: 107,
    question: "羊の寿命は平均してどれくらい？",
    choices: ["3〜5年", "5〜7年", "10〜12年", "20年以上"],
    correct_index: 2,
    explanation: <<~TEXT
      羊の平均寿命は10〜12年程度です。
      飼育環境が良いと、さらに長生きすることもあります。
    TEXT
  },

  # --- マニアック編 ---
  {
    code: 201,
    question: "羊の交配期が集中する主な季節はどれ？",
    choices: ["春", "夏", "秋", "冬"],
    correct_index: 2,
    explanation: <<~TEXT
      多くの羊は「秋」に繁殖期を迎える季節繁殖動物です。
      春に出産するよう進化しています。
    TEXT
  },
  {
    code: 202,
    question: "羊の群れでよく見られる行動「フライトゾーン」とは何？",
    choices: ["寝る場所", "食事をする範囲", "人が近づくと逃げる距離", "子羊の行動範囲"],
    correct_index: 2,
    explanation: <<~TEXT
      フライトゾーンとは、羊が危険を感じて逃げ始める距離のことです。
      家畜管理で重要な概念です。
    TEXT
  },
  {
    code: 203,
    question: "羊の群れを先導する個体に見られやすい性質はどれ？",
    choices: ["最も力が強い", "最も年をとっている", "人に慣れている", "視覚と記憶力が良い"],
    correct_index: 3,
    explanation: <<~TEXT
      羊の先導個体は、視覚や記憶力が良い個体であることが多いとされています。
      必ずしも力の強さでは決まりません。
    TEXT
  },
  {
    code: 204,
    question: "羊毛の細さを表す単位として使われるのはどれ？",
    choices: ["ミリメートル", "デニール", "ミクロン", "グラム"],
    correct_index: 2,
    explanation: <<~TEXT
      羊毛の太さは「ミクロン」で表されます。
      数値が小さいほど細く高級なウールです。
    TEXT
  },
  {
    code: 205,
    question: "メリノ系の羊毛が評価される最大の理由はどれ？",
    choices: ["色が白い", "毛が長い", "毛が非常に細かい", "量が多い"],
    correct_index: 2,
    explanation: <<~TEXT
      メリノの最大の特徴は、羊毛が非常に細かいことです。
      肌触りの良さにつながります。
    TEXT
  },
  {
    code: 206,
    question: "羊がストレスを受けたとき、最初に現れやすい行動はどれ？",
    choices: ["大声で鳴く", "食欲が増える", "動かなくなる", "群れから離れようとする"],
    correct_index: 3,
    explanation: <<~TEXT
      羊は強いストレスを受けると、群れから離れようとする傾向があります。
      これは危険信号とされています。
    TEXT
  },

  # --- 羊毛クイズ ---
  {
    code: 301,
    question: "メリノの羊毛が高級ウールとして評価される最大の理由はどれ？",
    choices: ["毛が長いから", "毛が非常に細かいから", "色が特別白いから", "量が多いから"],
    correct_index: 1,
    explanation: <<~TEXT
      メリノの最大の特徴は、羊毛が非常に細かいことです。
      細いほど肌触りが良く、高級衣料に向いています。
    TEXT
  },
  {
    code: 302,
    question: "シェトランドの羊毛がニット製品に多く使われる理由はどれ？",
    choices: ["とても硬いから", "水をはじくから", "細かく軽く、保温性が高いから", "色が必ず白いから"],
    correct_index: 2,
    explanation: <<~TEXT
      シェトランドの羊毛は細かく軽く、保温性に優れています。
      セーターやショールに向いた羊毛です。
    TEXT
  },
  {
    code: 303,
    question: "リンカーンやボーダー・レスターの羊毛の特徴として正しいのはどれ？",
    choices: ["非常に短い毛", "非常に細い毛", "長くて光沢のある毛", "ほとんど毛が生えない"],
    correct_index: 2,
    explanation: <<~TEXT
      長毛種と呼ばれ、毛が長く光沢があるのが特徴です。
      カーペットや織物に使われます。
    TEXT
  },
  {
    code: 305,
    question: "イースト・フリージアンの羊毛の評価として正しいのはどれ？",
    choices: ["最高級ウールとして有名", "ほとんど利用されない", "乳用が中心で、羊毛は副産物", "カーペット専用"],
    correct_index: 2,
    explanation: <<~TEXT
      イースト・フリージアンは乳用が主目的の品種です。
      羊毛は副産物として利用されます。
    TEXT
  },
  {
    code: 306,
    question: "羊毛の「ミクロン値」が小さいほど、一般的にどう評価される？",
    choices: ["丈夫になる", "重くなる", "細かく高級になる", "色が濃くなる"],
    correct_index: 2,
    explanation: <<~TEXT
      ミクロン値が小さいほど毛が細く、高級ウールとされます。
      肌触りの良さに直結します。
    TEXT
  },
  {
    code: 307,
    question: "カーペットやフェルト向きの羊毛に求められる性質はどれ？",
    choices: ["非常に細かい", "非常に短い", "太くて丈夫", "必ず白色"],
    correct_index: 2,
    explanation: <<~TEXT
      カーペット用の羊毛は、太くて丈夫な毛が向いています。
      長毛種の羊毛がよく使われます。
    TEXT
  },
]

puts "Seeding quizzes... size=#{SEED_QUIZZES.size}"

SEED_QUIZZES.each do |q|
  seed_quiz!(q)
end

puts "✅ Seed done: quizzes=#{Quiz.count}, choices=#{Choice.count}"

