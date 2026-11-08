import { useState } from 'react';
import { Scissors, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { FuriganaText } from '@/components/FuriganaText';

export function SentenceBreakdownCard() {
  const [sentence, setSentence] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ segments: { base: string; reading: string }[]; grammar: string } | null>(null);

  const example = {
    segments: [
      { base: '私', reading: 'わたし' },
      { base: 'は', reading: '' },
      { base: '日本', reading: 'にほん' },
      { base: '語', reading: 'ご' },
      { base: 'を', reading: '' },
      { base: '勉強', reading: 'べんきょう' },
      { base: 'しています', reading: '' },
    ],
    grammar: '〜ています：現在進行中の動作を表す。',
  };

  const handleAnalyze = () => {
    if (!sentence.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setResult(example);
      setAnalyzing(false);
    }, 900);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-matcha-300/60 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80 dark:hover:border-matcha-600/50">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-matcha-100/50 blur-2xl transition-all duration-500 group-hover:scale-150 dark:bg-matcha-700/20" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-soft">
              <Scissors className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[0.625rem] font-bold tracking-widest text-matcha-500 dark:text-matcha-400">A</span>
              <h3 className="font-serif text-base font-semibold leading-tight text-sumi-800 dark:text-washi-100">
                AI 智慧長句拆解
              </h3>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-sumi-400 dark:text-sumi-400">貼上任何日文句子，AI 幫你拆解</p>

        <div className="mt-4 flex flex-col gap-2.5">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="例：私は来月日本へ旅行に行く予定です。"
            rows={2}
            className="w-full resize-none rounded-xl border border-washi-200 bg-washi-50/80 px-3.5 py-2.5 text-sm text-sumi-700 placeholder:text-sumi-300 transition-all focus:border-matcha-300 focus:outline-none focus:ring-2 focus:ring-matcha-200/40 dark:border-sumi-600/80 dark:bg-sumi-700/50 dark:text-washi-100 dark:placeholder:text-sumi-500 dark:focus:ring-matcha-700/30"
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !sentence.trim()}
            className="group/btn flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 解析中…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 transition-transform group-hover/btn:rotate-12" /> 開始拆解
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-4 animate-scale-in space-y-2.5 rounded-xl border border-matcha-200/50 bg-gradient-to-br from-matcha-50/80 to-washi-50 p-4 dark:border-matcha-700/40 dark:from-matcha-700/20 dark:to-sumi-700/40">
            <p className="text-base font-medium leading-relaxed text-sumi-800 dark:text-washi-100">
              <FuriganaText segments={result.segments} />
            </p>
            <p className="border-t border-matcha-200/50 pt-2 text-xs text-sumi-500 dark:border-matcha-700/40 dark:text-sumi-300">
              {result.grammar}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
