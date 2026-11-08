import { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Headphones, Loader2, Music2, RotateCcw, X } from 'lucide-react';
import { useJlptWords, type WordWithProgress } from '@/hooks/useJlptWords';

const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
type Level = (typeof LEVELS)[number];

const MUSIC_SEARCHES = [
  { label: 'J-pop 歌單', query: 'J-pop 日本語 プレイリスト' },
  { label: '動漫歌曲', query: 'アニメソング 日本語 プレイリスト' },
  { label: '輕音樂', query: '日本語 作業用BGM' },
];

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function JlptInfinitePractice() {
  const n5 = useJlptWords('N5');
  const n4 = useJlptWords('N4');
  const n3 = useJlptWords('N3');
  const n2 = useJlptWords('N2');
  const n1 = useJlptWords('N1');
  const wordsByLevel: Record<Level, WordWithProgress[]> = {
    N5: n5.words, N4: n4.words, N3: n3.words, N2: n2.words, N1: n1.words,
  };
  const isLoading = n5.loading || n4.loading || n3.loading || n2.loading || n1.loading;

  const [level, setLevel] = useState<Level>('N5');
  const [workMode, setWorkMode] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState<WordWithProgress | null>(null);
  const [remaining, setRemaining] = useState<WordWithProgress[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const words = wordsByLevel[level];

  const options = useMemo(() => {
    if (!currentWord) return [];
    const distractors = shuffle(words.filter((word) => word.id !== currentWord.id)).slice(0, 3);
    return shuffle([currentWord, ...distractors].map((word) => word.meaning));
  }, [currentWord, words]);

  const start = () => {
    const pool = shuffle(words);
    if (!pool.length) return;
    setCurrentWord(pool[0]);
    setRemaining(pool.slice(1));
    setAnswer(null);
    setAnswered(0);
    setCorrect(0);
    setStarted(true);
  };

  const chooseAnswer = (choice: string) => {
    if (answer !== null || !currentWord) return;
    setAnswer(choice);
    setAnswered((count) => count + 1);
    const isCorrect = choice === currentWord.meaning;
    if (isCorrect) setCorrect((count) => count + 1);
    const nextPool = remaining.length ? remaining : shuffle(words);
    setCurrentWord(nextPool[0]);
    setRemaining(nextPool.slice(1));
  };

  const openMusicSearch = (query: string) => {
    window.open(`https://music.youtube.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" aria-labelledby="infinite-practice-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-matcha-500 dark:text-matcha-400">JLPT 無限練習</p>
          <h2 id="infinite-practice-title" className="mt-1 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
            從 N5 到 N1，持續練習
          </h2>
          <p className="mt-2 text-sm text-sumi-400 dark:text-sumi-300">題目會隨機輪替；完成一輪後自動重新洗牌，想練多久都可以。</p>
        </div>
        <button
          type="button"
          onClick={() => setWorkMode((enabled) => !enabled)}
          aria-pressed={workMode}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${workMode ? 'border-matcha-500 bg-matcha-500 text-white' : 'border-washi-200 bg-white/80 text-sumi-600 hover:border-matcha-300 dark:border-sumi-700 dark:bg-sumi-800 dark:text-washi-100'}`}
        >
          <Headphones className="h-4 w-4" /> {workMode ? '工作模式已開啟' : '開啟工作模式'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm dark:border-sumi-700/60 dark:bg-sumi-800/80 sm:p-6">
          <div className="flex flex-wrap gap-2" role="group" aria-label="選擇 JLPT 級別">
            {LEVELS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setLevel(item); setStarted(false); setCurrentWord(null); setAnswer(null); }}
                aria-pressed={level === item}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${level === item ? 'bg-matcha-500 text-white shadow-soft' : 'bg-washi-100 text-sumi-500 hover:bg-matcha-50 hover:text-matcha-700 dark:bg-sumi-700 dark:text-sumi-200 dark:hover:bg-sumi-600'}`}
              >
                {item}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center gap-2 text-sm text-sumi-400"><Loader2 className="h-4 w-4 animate-spin" /> 載入題庫中…</div>
          ) : !started || !currentWord ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-matcha-50 text-matcha-600 dark:bg-matcha-700/20 dark:text-matcha-300"><RotateCcw className="h-6 w-6" /></span>
              <p className="mt-4 font-serif text-lg font-bold text-sumi-800 dark:text-washi-100">{level} 隨機單字練習</p>
              <p className="mt-1 text-sm text-sumi-400">{words.length ? `目前題庫 ${words.length} 個單字，答完會重新洗牌` : '這個級別目前沒有可用題目'}</p>
              <button type="button" onClick={start} disabled={!words.length} className="mt-5 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">
                開始無限練習
              </button>
            </div>
          ) : (
            <div className="pt-6">
              <div className="mb-4 flex items-center justify-between text-xs text-sumi-400">
                <span>{level} · 第 {answered + 1} 題</span>
                <span>答對 {correct} / {answered}</span>
              </div>
              <div className="rounded-2xl border border-washi-200/80 bg-gradient-to-br from-white to-washi-50 p-7 text-center dark:border-sumi-700 dark:from-sumi-800 dark:to-sumi-900/70">
                <p className="text-xs font-medium tracking-widest text-matcha-600 dark:text-matcha-300">這個日文單字的意思是？</p>
                <p className="mt-4 font-serif text-5xl font-bold text-sumi-800 dark:text-washi-100">{currentWord.word}</p>
                <p className="mt-2 text-sm text-sumi-400">{currentWord.reading}</p>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {options.map((option) => {
                  const selected = answer === option;
                  const isRight = option === currentWord.meaning;
                  const reveal = answer !== null;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseAnswer(option)}
                      className={`flex min-h-12 items-center justify-between rounded-xl border p-3 text-left text-sm font-medium transition ${reveal && isRight ? 'border-matcha-300 bg-matcha-50 text-matcha-700 dark:bg-matcha-700/20 dark:text-matcha-200' : reveal && selected ? 'border-red-300 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300' : 'border-washi-200 bg-white/70 text-sumi-700 hover:border-matcha-300 dark:border-sumi-700 dark:bg-sumi-700/50 dark:text-washi-100'}`}
                    >
                      {option}
                      {reveal && isRight && <Check className="h-4 w-4" />}
                      {reveal && selected && !isRight && <X className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
              {answer !== null && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-washi-50 px-4 py-3 dark:bg-sumi-700/60">
                  <span className="text-sm text-sumi-600 dark:text-sumi-200">{currentWord.reading} · {currentWord.meaning}</span>
                  <button type="button" onClick={() => setAnswer(null)} className="rounded-lg bg-matcha-500 px-4 py-2 text-sm font-semibold text-white hover:bg-matcha-600">下一題</button>
                </div>
              )}
              {answer !== null && <button type="button" onClick={() => { setStarted(false); setCurrentWord(null); }} className="mt-3 text-xs text-sumi-400 underline underline-offset-4">結束本次練習</button>}
            </div>
          )}
        </div>

        <aside className={`rounded-2xl border p-5 shadow-soft transition-colors sm:p-6 ${workMode ? 'border-matcha-200 bg-matcha-50/80 dark:border-matcha-700/50 dark:bg-matcha-900/10' : 'border-washi-200/80 bg-white/70 dark:border-sumi-700/60 dark:bg-sumi-800/70'}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-wood-300 to-wood-500 text-white"><Music2 className="h-5 w-5" /></span>
            <div>
              <h3 className="font-serif font-bold text-sumi-800 dark:text-washi-100">日文歌工作模式</h3>
              <p className="text-xs text-sumi-400">選一種音樂，邊聽邊刷題</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sumi-500 dark:text-sumi-300">音樂會在 YouTube Music 新分頁開啟；讓音樂播放，再切回這裡繼續練習。</p>
          <div className="mt-5 flex flex-col gap-2">
            {MUSIC_SEARCHES.map((music) => (
              <button
                key={music.label}
                type="button"
                onClick={() => openMusicSearch(music.query)}
                className="flex items-center justify-between rounded-xl border border-washi-200/80 bg-white/80 px-3.5 py-3 text-left text-sm font-medium text-sumi-700 transition hover:border-matcha-300 hover:bg-matcha-50 dark:border-sumi-700 dark:bg-sumi-800/80 dark:text-washi-100 dark:hover:bg-sumi-700"
              >
                <span className="flex items-center gap-2"><Music2 className="h-4 w-4 text-matcha-500" />{music.label}</span>
                <ArrowUpRight className="h-4 w-4 text-sumi-400" />
              </button>
            ))}
          </div>
          <p className="mt-4 text-[0.7rem] leading-relaxed text-sumi-400">音樂來源為外部平台搜尋結果，播放內容與廣告由平台提供。</p>
        </aside>
      </div>
    </section>
  );
}
