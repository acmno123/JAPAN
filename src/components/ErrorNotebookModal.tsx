import { useState } from 'react';
import { Volume2, RotateCw, Check, X, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { FuriganaText } from '@/components/FuriganaText';
import { speakJapanese } from '@/utils/speech';

interface ErrorItem {
  word: string;
  reading: string;
  meaning: string;
  level: string;
  yourAnswer: string;
  correctAnswer: string;
}

const errorItems: ErrorItem[] = [
  {
    word: '経験',
    reading: 'けいけん',
    meaning: '經驗',
    level: 'N3',
    yourAnswer: 'きょうけん',
    correctAnswer: 'けいけん',
  },
  {
    word: '開発',
    reading: 'かいはつ',
    meaning: '開發',
    level: 'N3',
    yourAnswer: 'かいほつ',
    correctAnswer: 'かいはつ',
  },
  {
    word: '影響',
    reading: 'えいきょう',
    meaning: '影響',
    level: 'N3',
    yourAnswer: 'えいきょ',
    correctAnswer: 'えいきょう',
  },
  {
    word: '準備',
    reading: 'じゅんび',
    meaning: '準備',
    level: 'N4',
    yourAnswer: 'じゅんい',
    correctAnswer: 'じゅんび',
  },
];

interface ErrorNotebookModalProps {
  open: boolean;
  onClose: () => void;
}

export function ErrorNotebookModal({ open, onClose }: ErrorNotebookModalProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());

  const toggleReveal = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const markReviewed = (i: number) => {
    setReviewed((prev) => new Set(prev).add(i));
  };

  const reset = () => {
    setRevealed(new Set());
    setReviewed(new Set());
  };

  const remaining = errorItems.length - reviewed.size;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="錯題本"
      subtitle={`${remaining} 題待複習 · 共 ${errorItems.length} 題`}
      icon={<span className="text-base">📝</span>}
    >
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-sumi-500 dark:text-sumi-300">複習進度</span>
            <span className="font-semibold text-matcha-600 dark:text-matcha-300">{reviewed.size}/{errorItems.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-washi-100 dark:bg-sumi-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-matcha-400 to-matcha-500 transition-all duration-500"
              style={{ width: `${(reviewed.size / errorItems.length) * 100}%` }}
            />
          </div>
        </div>

        {errorItems.map((item, i) => {
          const isRevealed = revealed.has(i);
          const isReviewed = reviewed.has(i);
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 transition-all ${
                isReviewed
                  ? 'border-matcha-200/60 bg-matcha-50/50 dark:border-matcha-700/40 dark:bg-matcha-700/10'
                  : 'border-washi-200/80 bg-white/80 dark:border-sumi-700/60 dark:bg-sumi-700/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-8 items-center justify-center rounded-md bg-washi-100 text-[0.6rem] font-bold text-sumi-500 dark:bg-sumi-700 dark:text-sumi-300">
                      {item.level}
                    </span>
                    <p className="font-serif text-xl font-bold text-sumi-800 dark:text-washi-100">
                      <FuriganaText segments={[{ base: item.word, reading: isRevealed ? item.reading : '' }]} />
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-sumi-400">
                    {isRevealed ? item.meaning : '點擊翻面查看讀音'}
                  </p>
                  {isRevealed && (
                    <div className="mt-2 space-y-1.5 border-t border-washi-200/80 pt-2 dark:border-sumi-600/60">
                      <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                        <X className="h-3 w-3 shrink-0" /> 你的答案：<span className="font-medium">{item.yourAnswer}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-matcha-600 dark:text-matcha-300">
                        <Check className="h-3 w-3 shrink-0" /> 正確答案：<span className="font-medium">{item.correctAnswer}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleReveal(i)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-washi-200 text-sumi-400 transition-all hover:scale-105 hover:border-matcha-300 hover:text-matcha-500 dark:border-sumi-600 dark:text-sumi-300"
                    title={isRevealed ? '隱藏' : '翻面'}
                  >
                    <RotateCw className={`h-3.5 w-3.5 transition-transform ${isRevealed ? 'rotate-180' : ''}`} />
                  </button>
                  {isRevealed && (
                    <button
                      onClick={() => speakJapanese(item.word)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-matcha-400 to-matcha-500 text-white transition-transform hover:scale-105"
                      title="發音"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              {isRevealed && !isReviewed && (
                <button
                  onClick={() => markReviewed(i)}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-matcha-500 py-2 text-xs font-medium text-white transition-colors hover:bg-matcha-600"
                >
                  <Check className="h-3.5 w-3.5" /> 標記為已複習
                </button>
              )}
              {isReviewed && (
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-matcha-600 dark:text-matcha-300">
                  <Check className="h-3.5 w-3.5" /> 已複習
                </div>
              )}
            </div>
          );
        })}

        {reviewed.size === errorItems.length && (
          <div className="animate-scale-in rounded-xl border border-matcha-200/60 bg-gradient-to-br from-matcha-50 to-washi-50 p-6 text-center dark:border-matcha-700/40 dark:from-matcha-700/20 dark:to-sumi-700/40">
            <p className="text-2xl">🎉</p>
            <p className="mt-2 font-serif text-base font-bold text-sumi-800 dark:text-washi-100">全部複習完成！</p>
            <p className="mt-1 text-xs text-sumi-400">お疲れさまでした</p>
            <button
              onClick={reset}
              className="mt-3 flex items-center gap-1.5 rounded-full border border-matcha-300 bg-white px-4 py-2 text-xs font-medium text-matcha-600 transition-colors hover:bg-matcha-50 dark:border-matcha-600 dark:bg-sumi-700 dark:text-matcha-300"
            >
              <RotateCw className="h-3 w-3" /> 再複習一次
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
