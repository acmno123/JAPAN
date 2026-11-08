import { useState } from 'react';
import { Volume2, BookOpen, Loader2, Sparkles, Quote } from 'lucide-react';
import { FuriganaText } from '@/components/FuriganaText';

const dailySentence = {
  segments: [
    { base: '一', reading: 'いち' },
    { base: '日', reading: 'にち' },
    { base: '一', reading: 'いち' },
    { base: '日', reading: 'にち' },
    { base: '精', reading: 'せい' },
    { base: '進', reading: 'しん' },
  ],
  translation: '日復一日，精進不止。',
  breakdown:
    '「一日一日」(いちにちいちにち)：每天每天。「精進」(しょうじん)：努力上進。整句鼓勵每日持續學習、不斷進步。',
};

export function DailyRecommended() {
  const [playing, setPlaying] = useState(false);
  const [showParse, setShowParse] = useState(false);

  const handlePlay = () => {
    if (playing) return;
    setPlaying(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance('一日一日、精進');
      utter.lang = 'ja-JP';
      utter.rate = 0.85;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utter);
    } else {
      setTimeout(() => setPlaying(false), 1200);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-matcha-500">今日推薦</p>
          <h2 className="mt-0.5 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
            毎日の一言
          </h2>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-matcha-200/60 bg-matcha-50/80 px-3 py-1 text-xs font-medium text-matcha-600 sm:flex dark:border-matcha-700/50 dark:bg-matcha-700/20 dark:text-matcha-300">
          <Sparkles className="h-3 w-3" /> AI 生成
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-washi-200/80 bg-gradient-to-br from-white via-washi-50 to-matcha-50/30 p-6 shadow-soft sm:p-8 dark:border-sumi-700/60 dark:from-sumi-800 dark:via-sumi-800 dark:to-sumi-900">
        {/* decorative seal */}
        <div className="pointer-events-none absolute -right-6 -top-6 flex h-32 w-32 rotate-12 items-center justify-center rounded-2xl bg-matcha-500/8 dark:bg-matcha-400/10">
          <span className="font-serif text-6xl font-bold text-matcha-400/25 dark:text-matcha-300/20">
            日
          </span>
        </div>
        {/* vertical accent line */}
        <div className="pointer-events-none absolute left-0 top-1/2 h-16 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-matcha-300 to-matcha-500" />

        <div className="relative">
          <Quote className="h-6 w-6 text-matcha-300/50 dark:text-matcha-600/40" />
          <p className="mt-3 font-serif text-2xl font-medium leading-relaxed text-sumi-800 sm:text-3xl dark:text-washi-100">
            <FuriganaText segments={dailySentence.segments} />
          </p>
          <p className="mt-3 text-sm text-sumi-400 dark:text-sumi-300">
            {dailySentence.translation}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <button
              onClick={handlePlay}
              className="group relative flex items-center gap-2 rounded-full bg-gradient-to-r from-matcha-500 to-matcha-600 px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
            >
              {playing && (
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-matcha-400" />
              )}
              <Volume2 className="relative h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="relative">{playing ? '再生中…' : 'AI 語音播放'}</span>
            </button>
            <button
              onClick={() => setShowParse((p) => !p)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                showParse
                  ? 'border-matcha-300 bg-matcha-50 text-matcha-600 dark:border-matcha-600 dark:bg-matcha-700/30 dark:text-matcha-300'
                  : 'border-washi-200 bg-white/80 text-sumi-600 hover:border-matcha-300 hover:text-matcha-600 dark:border-sumi-600 dark:bg-sumi-700/40 dark:text-washi-100'
              }`}
            >
              {showParse ? <Loader2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              語意解析
            </button>
          </div>

          {showParse && (
            <div className="mt-4 animate-fade-in-up rounded-xl border border-washi-200/80 bg-white/80 p-4 text-sm leading-relaxed text-sumi-600 dark:border-sumi-600/80 dark:bg-sumi-700/40 dark:text-sumi-200">
              {dailySentence.breakdown}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
