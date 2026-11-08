/*
# JLPT Vocabulary System + User Progress Tracking

1. New Tables
- `jlpt_words`: Vocabulary words for JLPT levels N5–N1. Each word has kanji, kana reading,
  romaji, meaning (Chinese), part of speech, and JLPT level. Seeded with sample data.
- `user_word_progress`: Per-user progress on each word — tracks mastery status
  (new / learning / mastered), number of correct and wrong answers, and last reviewed time.
- `study_sessions`: Per-user study session records — tracks date, level studied,
  words reviewed, and correct count.

2. Security
- `jlpt_words`: RLS enabled, SELECT granted to `anon, authenticated` (public reference data).
- `user_word_progress`: RLS enabled, CRUD granted to `authenticated` only, owner-scoped via `user_id DEFAULT auth.uid()`.
- `study_sessions`: RLS enabled, CRUD granted to `authenticated` only, owner-scoped via `user_id DEFAULT auth.uid()`.

3. Notes
- `jlpt_words` is shared reference data readable by everyone (including anon for browsing).
- Progress data is private to each authenticated user.
- `user_word_progress.user_id` defaults to `auth.uid()` so frontend inserts work without passing user_id.
*/

-- JLPT words reference table (public read)
CREATE TABLE IF NOT EXISTS jlpt_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level text NOT NULL CHECK (level IN ('N5','N4','N3','N2','N1')),
  word text NOT NULL,
  reading text NOT NULL,
  romaji text NOT NULL,
  meaning text NOT NULL,
  part_of_speech text NOT NULL DEFAULT '名詞',
  example_jp text,
  example_reading text,
  example_meaning text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jlpt_words ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON jlpt_words TO anon, authenticated;

DROP POLICY IF EXISTS "read_jlpt_words" ON jlpt_words;
CREATE POLICY "read_jlpt_words" ON jlpt_words FOR SELECT
  TO anon, authenticated USING (true);

-- User per-word progress (private)
CREATE TABLE IF NOT EXISTS user_word_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id uuid NOT NULL REFERENCES jlpt_words(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','learning','mastered')),
  correct_count int NOT NULL DEFAULT 0,
  wrong_count int NOT NULL DEFAULT 0,
  last_reviewed timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word_id)
);

ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_word_progress TO authenticated;

DROP POLICY IF EXISTS "select_own_progress" ON user_word_progress;
CREATE POLICY "select_own_progress" ON user_word_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_progress" ON user_word_progress;
CREATE POLICY "insert_own_progress" ON user_word_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_progress" ON user_word_progress;
CREATE POLICY "update_own_progress" ON user_word_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_progress" ON user_word_progress;
CREATE POLICY "delete_own_progress" ON user_word_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Study sessions (private)
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  level text NOT NULL CHECK (level IN ('N5','N4','N3','N2','N1')),
  words_reviewed int NOT NULL DEFAULT 0,
  correct_count int NOT NULL DEFAULT 0,
  studied_at timestamptz DEFAULT now()
);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON study_sessions TO authenticated;

DROP POLICY IF EXISTS "select_own_sessions" ON study_sessions;
CREATE POLICY "select_own_sessions" ON study_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON study_sessions;
CREATE POLICY "insert_own_sessions" ON study_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON study_sessions;
CREATE POLICY "update_own_sessions" ON study_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON study_sessions;
CREATE POLICY "delete_own_sessions" ON study_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jlpt_words_level ON jlpt_words(level);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_word ON user_word_progress(word_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user ON study_sessions(user_id);

-- Seed sample JLPT words
INSERT INTO jlpt_words (level, word, reading, romaji, meaning, part_of_speech, example_jp, example_reading, example_meaning) VALUES
-- N5
('N5', '勉強', 'べんきょう', 'benkyou', '學習', '名詞・する動詞', '毎日日本語を勉強します。', 'まいにちにほんごをべんきょうします。', '每天學習日語。'),
('N5', '学校', 'がっこう', 'gakkou', '學校', '名詞', '学校は九時に始まります。', 'がっこうはくじにはじまります。', '學校九點開始。'),
('N5', '友達', 'ともだち', 'tomodachi', '朋友', '名詞', '友達と一緒に遊びます。', 'ともだちといっしょにあそびます。', '和朋友一起玩。'),
('N5', '天気', 'てんき', 'tenki', '天氣', '名詞', '今日はいい天気です。', 'きょうはいいてんきです。', '今天天氣好。'),
('N5', '食べる', 'たべる', 'taberu', '吃', '動詞', '朝ごはんを食べます。', 'あさごはんをたべます。', '吃早餐。'),
('N5', '飲む', 'のむ', 'nomu', '喝', '動詞', '水を飲みます。', 'みずをのみます。', '喝水。'),
('N5', '本', 'ほん', 'hon', '書', '名詞', 'この本は面白いです。', 'このほんはおもしろいです。', '這本書很有趣。'),
('N5', '水', 'みず', 'mizu', '水', '名詞', '水をください。', 'みずをください。', '請給我水。'),
('N5', '先生', 'せんせい', 'sensei', '老師', '名詞', '田中先生は日本語の先生です。', 'たなかせんせいはにほんごのせんせいです。', '田中老師是日語老師。'),
('N5', '日本人', 'にほんじん', 'nihonjin', '日本人', '名詞', '彼は日本人です。', 'かれはにほんじんです。', '他是日本人。'),
-- N4
('N4', '経験', 'けいけん', 'keiken', '經驗', '名詞・する動詞', '良い経験になりました。', 'よいけいけんになりました。', '成為了很好的經驗。'),
('N4', '準備', 'じゅんび', 'junbi', '準備', '名詞・する動詞', '試験の準備をします。', 'しけんのじゅんびをします。', '準備考試。'),
('N4', '説明', 'せつめい', 'setsumei', '說明', '名詞・する動詞', 'もう一度説明してください。', 'もういちどせつめいしてください。', '請再說明一次。'),
('N4', '約束', 'やくそく', 'yakusoku', '約定', '名詞・する動詞', '友達と約束があります。', 'ともだちとやくそくがあります。', '和朋友有約。'),
('N4', '気持ち', 'きもち', 'kimochi', '心情', '名詞', '今の気持ちは複雑です。', 'いまのきもちはふくざつです。', '現在的心情很複雜。'),
('N4', '質問', 'しつもん', 'shitsumon', '問題', '名詞・する動詞', '質問があります。', 'しつもんがあります。', '有問題想問。'),
('N4', '大切', 'たいせつ', 'taisetsu', '重要', 'な形容詞', '時間は大切です。', 'じかんはたいせつです。', '時間很重要。'),
('N4', '仕事', 'しごと', 'shigoto', '工作', '名詞', '仕事が忙しいです。', 'しごとがいそがしいです。', '工作很忙。'),
('N4', '便利', 'べんり', 'benri', '方便', 'な形容詞', 'コンビニは便利です。', 'こんびにはべんりです。', '便利商店很方便。'),
('N4', '健康', 'けんこう', 'kenkou', '健康', '名詞・な形容詞', '健康に気をつけてください。', 'けんこうにきをつけてください。', '請注意健康。'),
-- N3
('N3', '影響', 'えいきょう', 'eikyou', '影響', '名詞・する動詞', '環境に影響を与える。', 'かんきょうにえいきょうをあたえる。', '對環境造成影響。'),
('N3', '開発', 'かいはつ', 'kaihatsu', '開發', '名詞・する動詞', '新しい製品を開発する。', 'あたらしいせいひんをかいはつする。', '開發新產品。'),
('N3', '経済', 'けいざい', 'keizai', '經濟', '名詞', '経済が成長している。', 'けいざいがせいちょうしている。', '經濟正在成長。'),
('N3', '可能性', 'かのうせい', 'kanousei', '可能性', '名詞', '可能性が高い。', 'かのうせいがたかい。', '可能性很高。'),
('N3', '表現', 'ひょうげん', 'hyougen', '表現', '名詞・する動詞', '自然な表現を学ぶ。', 'しぜんなひょうげんをまなぶ。', '學習自然的表現。'),
('N3', '印象', 'いんしょう', 'inshou', '印象', '名詞', '良い印象を受けた。', 'よいいんしょうをうけた。', '留下了好印象。'),
('N3', '感覚', 'かんかく', 'kankaku', '感覺', '名詞', '鋭い感覚を持っている。', 'するどいかんかくをもっている。', '擁有敏銳的感覺。'),
('N3', '現代', 'げんだい', 'gendai', '現代', '名詞', '現代の芸術。', 'げんだいのげいじゅつ。', '現代藝術。'),
('N3', '成功', 'せいこう', 'seikou', '成功', '名詞・する動詞', '努力が成功につながる。', 'どりょくがせいこうにつながる。', '努力帶來成功。'),
('N3', '失敗', 'しっぱい', 'shippai', '失敗', '名詞・する動詞', '失敗から学ぶ。', 'しっぱいからまなぶ。', '從失敗中學習。'),
-- N2
('N2', '推測', 'すいそく', 'suisoku', '推測', '名詞・する動詞', '結果を推測する。', 'けっかをすいそくする。', '推測結果。'),
('N2', '抽象', 'ちゅうしょう', 'chuushou', '抽象', '名詞・な形容詞', '抽象的な概念。', 'ちゅうしょうてきながいねん。', '抽象的概念。'),
('N2', '曖昧', 'あいまい', 'aimai', '曖昧', 'な形容詞', '曖昧な答え。', 'あいまいなこたえ。', '曖昧的回答。'),
('N2', '妥協', 'だきょう', 'dakyou', '妥協', '名詞・する動詞', '妥協できない。', 'だきょうできない。', '無法妥協。'),
('N2', '待遇', 'たいぐう', 'taiguu', '待遇', '名詞', '待遇が良い。', 'たいぐうがよい。', '待遇很好。'),
('N2', '要請', 'ようせい', 'yousei', '要求', '名詞・する動詞', '緊急の要請。', 'きんきゅうのようせい。', '緊急要求。'),
('N2', '基準', 'きじゅん', 'kijun', '基準', '名詞', '高い基準を設ける。', 'たかいきじゅんをもうける。', '設定高標準。'),
('N2', '特徴', 'とくちょう', 'tokuchou', '特徵', '名詞', '特徴的なデザイン。', 'とくちょうてきなでざいん。', '具特色的設計。'),
('N2', '確認', 'かくにん', 'kakunin', '確認', '名詞・する動詞', '事実を確認する。', 'じじつをかくにんする。', '確認事實。'),
('N2', '対応', 'たいおう', 'taiou', '應對', '名詞・する動詞', '迅速に対応する。', 'じんそくにたいおうする。', '迅速應對。'),
-- N1
('N1', '拘束', 'こうそく', 'kousoku', '拘束', '名詞・する動詞', '自由を拘束する。', 'じゆうをこうそくする。', '拘束自由。'),
('N1', '是非', 'ぜひ', 'zehi', '是非', '名詞', '是非を問わず。', 'ぜひをとわず。', '不問是非。'),
('N1', '妥当', 'だとう', 'datou', '妥當', 'な形容詞', '妥当な判断。', 'だとうなはんだん。', '妥當的判斷。'),
('N1', '過密', 'かみつ', 'kamitsu', '過密', '名詞・な形容詞', '過密なスケジュール。', 'かみつなすけじゅーる。', '過密的行程。'),
('N1', '頑健', 'がんけん', 'ganken', '強健', 'な形容詞', '頑健な体質。', 'がんけんなたいしつ。', '強健的體質。'),
('N1', '疲弊', 'ひへい', 'hihei', '疲憊', '名詞・する動詞', '疲弊した経済。', 'ひへいしたけいざい。', '疲憊的經濟。'),
('N1', '執着', 'しゅうちゃく', 'shuuchaku', '執著', '名詞・する動詞', '結果に執着する。', 'けっかにしゅうちゃくする。', '對結果執著。'),
('N1', '洞察', 'どうさつ', 'dousatsu', '洞察', '名詞・する動詞', '鋭い洞察力。', 'するどいどうさつりょく。', '敏銳的洞察力。'),
('N1', '恪守', 'かくしゅ', 'kakushu', '恪守', '名詞・する動詞', '規則を恪守する。', 'きそくをかくしゅする。', '恪守規則。'),
('N1', '永遠', 'えいえん', 'eien', '永遠', '名詞', '永遠の愛。', 'えいえんのあい。', '永遠的愛。')
ON CONFLICT DO NOTHING;
