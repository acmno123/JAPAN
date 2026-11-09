export interface JlptWord {
  id: string;
  level: string;
  word: string;
  reading: string;
  romaji: string;
  meaning: string;
  part_of_speech: string;
  example_jp: string | null;
  example_reading: string | null;
  example_meaning: string | null;
}

export const jlptWords: JlptWord[] = [
  // N5
  { id: 'n5-01', level: 'N5', word: '勉強', reading: 'べんきょう', romaji: 'benkyou', meaning: '學習', part_of_speech: '名詞・する動詞', example_jp: '毎日日本語を勉強します。', example_reading: 'まいにちにほんごをべんきょうします。', example_meaning: '每天學習日語。' },
  { id: 'n5-02', level: 'N5', word: '学校', reading: 'がっこう', romaji: 'gakkou', meaning: '學校', part_of_speech: '名詞', example_jp: '学校は九時に始まります。', example_reading: 'がっこうはくじにはじまります。', example_meaning: '學校九點開始。' },
  { id: 'n5-03', level: 'N5', word: '友達', reading: 'ともだち', romaji: 'tomodachi', meaning: '朋友', part_of_speech: '名詞', example_jp: '友達と一緒に遊びます。', example_reading: 'ともだちといっしょにあそびます。', example_meaning: '和朋友一起玩。' },
  { id: 'n5-04', level: 'N5', word: '天気', reading: 'てんき', romaji: 'tenki', meaning: '天氣', part_of_speech: '名詞', example_jp: '今日はいい天気です。', example_reading: 'きょうはいいてんきです。', example_meaning: '今天天氣好。' },
  { id: 'n5-05', level: 'N5', word: '食べる', reading: 'たべる', romaji: 'taberu', meaning: '吃', part_of_speech: '動詞', example_jp: '朝ごはんを食べます。', example_reading: 'あさごはんをたべます。', example_meaning: '吃早餐。' },
  { id: 'n5-06', level: 'N5', word: '飲む', reading: 'のむ', romaji: 'nomu', meaning: '喝', part_of_speech: '動詞', example_jp: '水を飲みます。', example_reading: 'みずをのみます。', example_meaning: '喝水。' },
  { id: 'n5-07', level: 'N5', word: '本', reading: 'ほん', romaji: 'hon', meaning: '書', part_of_speech: '名詞', example_jp: 'この本は面白いです。', example_reading: 'このほんはおもしろいです。', example_meaning: '這本書很有趣。' },
  { id: 'n5-08', level: 'N5', word: '水', reading: 'みず', romaji: 'mizu', meaning: '水', part_of_speech: '名詞', example_jp: '水をください。', example_reading: 'みずをください。', example_meaning: '請給我水。' },
  { id: 'n5-09', level: 'N5', word: '先生', reading: 'せんせい', romaji: 'sensei', meaning: '老師', part_of_speech: '名詞', example_jp: '田中先生は日本語の先生です。', example_reading: 'たなかせんせいはにほんごのせんせいです。', example_meaning: '田中老師是日語老師。' },
  { id: 'n5-10', level: 'N5', word: '日本人', reading: 'にほんじん', romaji: 'nihonjin', meaning: '日本人', part_of_speech: '名詞', example_jp: '彼は日本人です。', example_reading: 'かれはにほんじんです。', example_meaning: '他是日本人。' },
  // N4
  { id: 'n4-01', level: 'N4', word: '経験', reading: 'けいけん', romaji: 'keiken', meaning: '經驗', part_of_speech: '名詞・する動詞', example_jp: '良い経験になりました。', example_reading: 'よいけいけんになりました。', example_meaning: '成為了很好的經驗。' },
  { id: 'n4-02', level: 'N4', word: '準備', reading: 'じゅんび', romaji: 'junbi', meaning: '準備', part_of_speech: '名詞・する動詞', example_jp: '試験の準備をします。', example_reading: 'しけんのじゅんびをします。', example_meaning: '準備考試。' },
  { id: 'n4-03', level: 'N4', word: '説明', reading: 'せつめい', romaji: 'setsumei', meaning: '說明', part_of_speech: '名詞・する動詞', example_jp: 'もう一度説明してください。', example_reading: 'もういちどせつめいしてください。', example_meaning: '請再說明一次。' },
  { id: 'n4-04', level: 'N4', word: '約束', reading: 'やくそく', romaji: 'yakusoku', meaning: '約定', part_of_speech: '名詞・する動詞', example_jp: '友達と約束があります。', example_reading: 'ともだちとやくそくがあります。', example_meaning: '和朋友有約。' },
  { id: 'n4-05', level: 'N4', word: '気持ち', reading: 'きもち', romaji: 'kimochi', meaning: '心情', part_of_speech: '名詞', example_jp: '今の気持ちは複雑です。', example_reading: 'いまのきもちはふくざつです。', example_meaning: '現在的心情很複雜。' },
  { id: 'n4-06', level: 'N4', word: '質問', reading: 'しつもん', romaji: 'shitsumon', meaning: '問題', part_of_speech: '名詞・する動詞', example_jp: '質問があります。', example_reading: 'しつもんがあります。', example_meaning: '有問題想問。' },
  { id: 'n4-07', level: 'N4', word: '大切', reading: 'たいせつ', romaji: 'taisetsu', meaning: '重要', part_of_speech: 'な形容詞', example_jp: '時間は大切です。', example_reading: 'じかんはたいせつです。', example_meaning: '時間很重要。' },
  { id: 'n4-08', level: 'N4', word: '仕事', reading: 'しごと', romaji: 'shigoto', meaning: '工作', part_of_speech: '名詞', example_jp: '仕事が忙しいです。', example_reading: 'しごとがいそがしいです。', example_meaning: '工作很忙。' },
  { id: 'n4-09', level: 'N4', word: '便利', reading: 'べんり', romaji: 'benri', meaning: '方便', part_of_speech: 'な形容詞', example_jp: 'コンビニは便利です。', example_reading: 'こんびにはべんりです。', example_meaning: '便利商店很方便。' },
  { id: 'n4-10', level: 'N4', word: '健康', reading: 'けんこう', romaji: 'kenkou', meaning: '健康', part_of_speech: '名詞・な形容詞', example_jp: '健康に気をつけてください。', example_reading: 'けんこうにきをつけてください。', example_meaning: '請注意健康。' },
  // N3
  { id: 'n3-01', level: 'N3', word: '影響', reading: 'えいきょう', romaji: 'eikyou', meaning: '影響', part_of_speech: '名詞・する動詞', example_jp: '環境に影響を与える。', example_reading: 'かんきょうにえいきょうをあたえる。', example_meaning: '對環境造成影響。' },
  { id: 'n3-02', level: 'N3', word: '開発', reading: 'かいはつ', romaji: 'kaihatsu', meaning: '開發', part_of_speech: '名詞・する動詞', example_jp: '新しい製品を開発する。', example_reading: 'あたらしいせいひんをかいはつする。', example_meaning: '開發新產品。' },
  { id: 'n3-03', level: 'N3', word: '経済', reading: 'けいざい', romaji: 'keizai', meaning: '經濟', part_of_speech: '名詞', example_jp: '経済が成長している。', example_reading: 'けいざいがせいちょうしている。', example_meaning: '經濟正在成長。' },
  { id: 'n3-04', level: 'N3', word: '可能性', reading: 'かのうせい', romaji: 'kanousei', meaning: '可能性', part_of_speech: '名詞', example_jp: '可能性が高い。', example_reading: 'かのうせいがたかい。', example_meaning: '可能性很高。' },
  { id: 'n3-05', level: 'N3', word: '表現', reading: 'ひょうげん', romaji: 'hyougen', meaning: '表現', part_of_speech: '名詞・する動詞', example_jp: '自然な表現を学ぶ。', example_reading: 'しぜんなひょうげんをまなぶ。', example_meaning: '學習自然的表現。' },
  { id: 'n3-06', level: 'N3', word: '印象', reading: 'いんしょう', romaji: 'inshou', meaning: '印象', part_of_speech: '名詞', example_jp: '良い印象を受けた。', example_reading: 'よいいんしょうをうけた。', example_meaning: '留下了好印象。' },
  { id: 'n3-07', level: 'N3', word: '感覚', reading: 'かんかく', romaji: 'kankaku', meaning: '感覺', part_of_speech: '名詞', example_jp: '鋭い感覚を持っている。', example_reading: 'するどいかんかくをもっている。', example_meaning: '擁有敏銳的感覺。' },
  { id: 'n3-08', level: 'N3', word: '現代', reading: 'げんだい', romaji: 'gendai', meaning: '現代', part_of_speech: '名詞', example_jp: '現代の芸術。', example_reading: 'げんだいのげいじゅつ。', example_meaning: '現代藝術。' },
  { id: 'n3-09', level: 'N3', word: '成功', reading: 'せいこう', romaji: 'seikou', meaning: '成功', part_of_speech: '名詞・する動詞', example_jp: '努力が成功につながる。', example_reading: 'どりょくがせいこうにつながる。', example_meaning: '努力帶來成功。' },
  { id: 'n3-10', level: 'N3', word: '失敗', reading: 'しっぱい', romaji: 'shippai', meaning: '失敗', part_of_speech: '名詞・する動詞', example_jp: '失敗から学ぶ。', example_reading: 'しっぱいからまなぶ。', example_meaning: '從失敗中學習。' },
  // N2
  { id: 'n2-01', level: 'N2', word: '推測', reading: 'すいそく', romaji: 'suisoku', meaning: '推測', part_of_speech: '名詞・する動詞', example_jp: '結果を推測する。', example_reading: 'けっかをすいそくする。', example_meaning: '推測結果。' },
  { id: 'n2-02', level: 'N2', word: '抽象', reading: 'ちゅうしょう', romaji: 'chuushou', meaning: '抽象', part_of_speech: '名詞・な形容詞', example_jp: '抽象的な概念。', example_reading: 'ちゅうしょうてきながいねん。', example_meaning: '抽象的概念。' },
  { id: 'n2-03', level: 'N2', word: '曖昧', reading: 'あいまい', romaji: 'aimai', meaning: '曖昧', part_of_speech: 'な形容詞', example_jp: '曖昧な答え。', example_reading: 'あいまいなこたえ。', example_meaning: '曖昧的回答。' },
  { id: 'n2-04', level: 'N2', word: '妥協', reading: 'だきょう', romaji: 'dakyou', meaning: '妥協', part_of_speech: '名詞・する動詞', example_jp: '妥協できない。', example_reading: 'だきょうできない。', example_meaning: '無法妥協。' },
  { id: 'n2-05', level: 'N2', word: '待遇', reading: 'たいぐう', romaji: 'taiguu', meaning: '待遇', part_of_speech: '名詞', example_jp: '待遇が良い。', example_reading: 'たいぐうがよい。', example_meaning: '待遇很好。' },
  { id: 'n2-06', level: 'N2', word: '要請', reading: 'ようせい', romaji: 'yousei', meaning: '要求', part_of_speech: '名詞・する動詞', example_jp: '緊急の要請。', example_reading: 'きんきゅうのようせい。', example_meaning: '緊急要求。' },
  { id: 'n2-07', level: 'N2', word: '基準', reading: 'きじゅん', romaji: 'kijun', meaning: '基準', part_of_speech: '名詞', example_jp: '高い基準を設ける。', example_reading: 'たかいきじゅんをもうける。', example_meaning: '設定高標準。' },
  { id: 'n2-08', level: 'N2', word: '特徴', reading: 'とくちょう', romaji: 'tokuchou', meaning: '特徵', part_of_speech: '名詞', example_jp: '特徴的なデザイン。', example_reading: 'とくちょうてきなでざいん。', example_meaning: '具特色的設計。' },
  { id: 'n2-09', level: 'N2', word: '確認', reading: 'かくにん', romaji: 'kakunin', meaning: '確認', part_of_speech: '名詞・する動詞', example_jp: '事実を確認する。', example_reading: 'じじつをかくにんする。', example_meaning: '確認事實。' },
  { id: 'n2-10', level: 'N2', word: '対応', reading: 'たいおう', romaji: 'taiou', meaning: '應對', part_of_speech: '名詞・する動詞', example_jp: '迅速に対応する。', example_reading: 'じんそくにたいおうする。', example_meaning: '迅速應對。' },
  // N1
  { id: 'n1-01', level: 'N1', word: '拘束', reading: 'こうそく', romaji: 'kousoku', meaning: '拘束', part_of_speech: '名詞・する動詞', example_jp: '自由を拘束する。', example_reading: 'じゆうをこうそくする。', example_meaning: '拘束自由。' },
  { id: 'n1-02', level: 'N1', word: '是非', reading: 'ぜひ', romaji: 'zehi', meaning: '是非', part_of_speech: '名詞', example_jp: '是非を問わず。', example_reading: 'ぜひをとわず。', example_meaning: '不問是非。' },
  { id: 'n1-03', level: 'N1', word: '妥当', reading: 'だとう', romaji: 'datou', meaning: '妥當', part_of_speech: 'な形容詞', example_jp: '妥当な判断。', example_reading: 'だとうなはんだん。', example_meaning: '妥當的判斷。' },
  { id: 'n1-04', level: 'N1', word: '過密', reading: 'かみつ', romaji: 'kamitsu', meaning: '過密', part_of_speech: '名詞・な形容詞', example_jp: '過密なスケジュール。', example_reading: 'かみつなすけじゅーる。', example_meaning: '過密的行程。' },
  { id: 'n1-05', level: 'N1', word: '頑健', reading: 'がんけん', romaji: 'ganken', meaning: '強健', part_of_speech: 'な形容詞', example_jp: '頑健な体質。', example_reading: 'がんけんなたいしつ。', example_meaning: '強健的體質。' },
  { id: 'n1-06', level: 'N1', word: '疲弊', reading: 'ひへい', romaji: 'hihei', meaning: '疲憊', part_of_speech: '名詞・する動詞', example_jp: '疲弊した経済。', example_reading: 'ひへいしたけいざい。', example_meaning: '疲憊的經濟。' },
  { id: 'n1-07', level: 'N1', word: '執着', reading: 'しゅうちゃく', romaji: 'shuuchaku', meaning: '執著', part_of_speech: '名詞・する動詞', example_jp: '結果に執着する。', example_reading: 'けっかにしゅうちゃくする。', example_meaning: '對結果執著。' },
  { id: 'n1-08', level: 'N1', word: '洞察', reading: 'どうさつ', romaji: 'dousatsu', meaning: '洞察', part_of_speech: '名詞・する動詞', example_jp: '鋭い洞察力。', example_reading: 'するどいどうさつりょく。', example_meaning: '敏銳的洞察力。' },
  { id: 'n1-09', level: 'N1', word: '恪守', reading: 'かくしゅ', romaji: 'kakushu', meaning: '恪守', part_of_speech: '名詞・する動詞', example_jp: '規則を恪守する。', example_reading: 'きそくをかくしゅする。', example_meaning: '恪守規則。' },
  { id: 'n1-10', level: 'N1', word: '永遠', reading: 'えいえん', romaji: 'eien', meaning: '永遠', part_of_speech: '名詞', example_jp: '永遠の愛。', example_reading: 'えいえんのあい。', example_meaning: '永遠的愛。' },
];

export function getWordsByLevel(level: string): JlptWord[] {
  return jlptWords.filter((w) => w.level === level).sort((a, b) => a.word.localeCompare(b.word, 'ja'));
}
