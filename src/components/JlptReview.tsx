import { useState, useMemo } from 'react';
import {
  Brain, Volume2, RotateCw, Check, X, ChevronLeft, ChevronRight,
  Sparkles, Trophy, Loader2, Lock, BarChart3, Shuffle,
} from 'lucide-react';
import { useJlptWords, type WordWithProgress } from '@/hooks/useJlptWords';
import { useAuth } from '@/context/AuthContext';
import { FuriganaText } from '@/components/FuriganaText';
import { speakJapanese } from '@/utils/speech';

const LEVELS = [
  { name: 'N5', color: 'from-matcha-400 to-matcha-500', bg: 'bg-matcha-50 dark:bg-matcha-700/20', text: 'text-matcha-600 dark:text-matcha-300', desc: '基礎' },
  { name: 'N4', color: 'from-matcha-300 to-matcha-500', bg: 'bg-matcha-50 dark:bg-matcha-700/20', text: 'text-matcha-600 dark:text-matcha-300', desc: '初級' },
  { name: 'N3', color: 'from-wood-300 to-wood-500', bg: 'bg-wood-100 dark:bg-wood-500/20', text: 'text-wood-500 dark:text-wood-200', desc: '中級' },
  { name: 'N2', color: 'from-sumi-400 to-sumi-600', bg: 'bg-washi-100 dark:bg-sumi-700/40', text: 'text-sumi-500 dark:text-sumi-300', desc: '上級' },
  { name: 'N1', color: 'from-sumi-600 to-sumi-800', bg: 'bg-washi-100 dark:bg-sumi-700/40', text: 'text-sumi-600 dark:text-sumi-300', desc: '最高級' },
];

type Mode = 'select' | 'flashcard' | 'quiz' | 'result';

export function JlptReview() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('select');
  const [selectedLevel, setSelectedLevel] = useState<string>('N5');
  const { words, loading, recordAnswer, saveSession } = useJlptWords(selectedLevel);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordWithProgress[]>([]);

  const startReview = (level: string, shuffle = false) => {
    setSelectedLevel(level);
    setMode('flashcard');
    setCurrentIndex(0);
    setFlipped(false);
    setCorrectCount(0);
    setReviewedCount(0);
    if (shuffle) {
      setShuffledWords([...words].sort(() => Math.random() - 0.5));
    } else {
      setShuffledWords([]);
    }
  };

  const startQuiz = (level: string) => {
    setSelectedLevel(level);
    setMode('quiz');
    setCurrentIndex(0);
    setQuizAnswer(null);
    setCorrectCount(0);
    setReviewedCount(0);
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
  };

  const reviewList = shuffledWords.length > 0 ? shuffledWords : words;
  const currentWord = reviewList[currentIndex];

  const handleFlashcardAnswer = async (correct: boolean) => {
    if (!currentWord) return;
    await recordAnswer(currentWord.id, correct);
    if (correct) setCorrectCount((c) => c + 1);
    setReviewedCount((c) => c + 1);
    if (currentIndex < reviewList.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    } else {
      await saveSession(selectedLevel, reviewedCount + 1, correct ? correctCount + 1 : correctCount);
      setMode('result');
    }
  };

  const handleQuizAnswer = async (answer: string) => {
    if (!currentWord || quizAnswer) return;
    setQuizAnswer(answer);
    const correct = answer === currentWord.meaning;
    await recordAnswer(currentWord.id, correct);
    if (correct) setCorrectCount((c) => c + 1);
    setReviewedCount((c) => c + 1);
  };

  const nextQuiz = async () => {
    setQuizAnswer(null);
    if (currentIndex < reviewList.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      await saveSession(selectedLevel, reviewedCount, correctCount);
      setMode('result');
    }
  };

  const quizOptions = useMemo(() => {
    if (!currentWord) return [];
    const others = words.filter((w) => w.id !== currentWord.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [currentWord, ...others].sort(() => Math.random() - 0.5).map((w) => w.meaning);
  }, [currentWord, words]);

  // Progress stats per level
  const stats = useMemo(() => {
    const mastered = words.filter((w) => w.progress?.status === 'mastered').length;
    const learning = words.filter((w) => w.progress?.status === 'learning').length;
    const total = words.length;
    return { mastered, learning, total, pct: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }, [words]);

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" id="review">
        <div className="mb-5">
          <p className="text-sm font-medium tracking-wide text-matcha-500">JLPT 複習</p>
          <h2 className="mt-0.5 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
            N5 から N1 まで
          </h2>
        </div>
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-washi-300 bg-white/50 p-12 text-center dark:border-sumi-600 dark:bg-sumi-800/50">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-soft">
            <Lock className="h-6 w-6" />
          </span>
          <div>
            <p className="font-serif text-lg font-bold text-sumi-700 dark:text-washi-100">請先登入</p>
            <p className="mt-1 text-sm text-sumi-400">登入後即可開始 JLPT 單字複習</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8" id="review">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-matcha-500">JLPT 複習</p>
          <h2 className="mt-0.5 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
            N5 から N1 まで
          </h2>
          <p className="mt-1.5 text-sm text-sumi-400 dark:text-sumi-300">
            選擇級別，開始單字卡片複習或選擇題測驗
          </p>
        </div>
        <span className="hidden h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-washi-300 to-transparent sm:block dark:via-sumi-700" />
      </div>

      {mode === 'select' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LEVELS.map((lv) => (
            <div
              key={lv.name}
              className="group relative overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80"
            >
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${lv.bg} blur-2xl transition-all group-hover:scale-150`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className={`flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${lv.color} font-serif text-lg font-bold text-white shadow-soft`}>
                    {lv.name}
                  </span>
                  <span className={`text-xs font-medium ${lv.text}`}>{lv.desc}</span>
                </div>

                {loading && selectedLevel === lv.name ? (
                  <div className="mt-4 flex items-center gap-2 text-xs text-sumi-400">
                    <Loader2 className="h-3 w-3 animate-spin" /> 読み込み中…
                  </div>
                ) : (
                  <>
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="mb-1 flex items-center justify-between text-[0.65rem]">
                        <span className="text-sumi-400">掌握度</span>
                        <span className={`font-semibold ${lv.text}`}>{stats.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-washi-100 dark:bg-sumi-700">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${lv.color} transition-all duration-500`}
                          style={{ width: `${stats.pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => startReview(lv.name)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-matcha-500 to-matcha-600 py-2 text-xs font-medium text-white transition-all hover:shadow-soft"
                      >
                        <RotateCw className="h-3 w-3" /> 卡片複習
                      </button>
                      <button
                        onClick={() => startQuiz(lv.name)}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-washi-200/80 bg-washi-50/80 py-2 text-xs font-medium text-sumi-600 transition-all hover:border-matcha-300 hover:text-matcha-600 dark:border-sumi-600/80 dark:bg-sumi-700/40 dark:text-washi-100"
                      >
                        <Brain className="h-3 w-3" /> 選擇題測驗
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flashcard mode */}
      {mode === 'flashcard' && currentWord && (
        <FlashcardView
          word={currentWord}
          index={currentIndex}
          total={reviewList.length}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onAnswer={handleFlashcardAnswer}
          correctCount={correctCount}
        />
      )}

      {/* Quiz mode */}
      {mode === 'quiz' && currentWord && (
        <QuizView
          word={currentWord}
          options={quizOptions}
          index={currentIndex}
          total={reviewList.length}
          quizAnswer={quizAnswer}
          onAnswer={handleQuizAnswer}
          onNext={nextQuiz}
          correctCount={correctCount}
        />
      )}

      {/* Result mode */}
      {mode === 'result' && (
        <ResultView
          level={selectedLevel}
          total={reviewedCount}
          correct={correctCount}
          onBack={() => setMode('select')}
          onRetry={() => startReview(selectedLevel, true)}
        />
      )}
    </section>
  );
}

function ProgressBar({ index, total }: { index: number; total: number }) {
  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-washi-100 dark:bg-sumi-700">
      <div className="h-full rounded-full bg-gradient-to-r from-matcha-400 to-matcha-500 transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FlashcardView({
  word, index, total, flipped, onFlip, onAnswer, correctCount,
}: {
  word: WordWithProgress; index: number; total: number; flipped: boolean;
  onFlip: () => void; onAnswer: (correct: boolean) => void; correctCount: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-sumi-400 transition-colors hover:text-sumi-600 dark:hover:text-washi-200"
        >
          <ChevronLeft className="h-4 w-4" /> 結束
        </button>
        <span className="text-sm font-medium text-sumi-500 dark:text-sumi-300">
          {index + 1} / {total} · 正解 {correctCount}
        </span>
      </div>
      <ProgressBar index={index} total={total} />

      {/* Card */}
      <div
        onClick={onFlip}
        className="group mt-6 cursor-pointer perspective-1000"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative h-72 transition-transform duration-500"
          style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : '' }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-washi-200/80 bg-gradient-to-br from-white to-washi-50 shadow-soft-lg dark:border-sumi-700/60 dark:from-sumi-800 dark:to-sumi-900"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="absolute left-4 top-4 rounded-md bg-washi-100 px-2 py-0.5 text-[0.65rem] font-bold text-sumi-500 dark:bg-sumi-700 dark:text-sumi-300">
              {word.level}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); speakJapanese(word.word); }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-matcha-50 text-matcha-600 transition-transform hover:scale-110 dark:bg-matcha-700/30 dark:text-matcha-300"
            >
              <Volume2 className="h-4 w-4" />
            </button>
            <p className="font-serif text-5xl font-bold text-sumi-800 dark:text-washi-100">
              <FuriganaText segments={[{ base: word.word, reading: flipped ? '' : '' }]} />
            </p>
            <p className="mt-3 text-sm text-sumi-400 dark:text-sumi-400">
              {word.part_of_speech}
            </p>
            <p className="mt-6 animate-pulse text-xs text-matcha-500">點擊翻面</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-matcha-200/60 bg-gradient-to-br from-matcha-50 to-washi-50 shadow-soft-lg dark:border-matcha-700/40 dark:from-matcha-700/20 dark:to-sumi-800"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="font-serif text-3xl font-bold text-matcha-600 dark:text-matcha-300">
              {word.reading}
            </p>
            <p className="mt-1 text-sm text-sumi-400">{word.romaji}</p>
            <p className="mt-4 font-serif text-2xl font-semibold text-sumi-800 dark:text-washi-100">
              {word.meaning}
            </p>
            {word.example_jp && (
              <div className="mt-5 rounded-xl bg-white/60 px-4 py-2.5 text-center dark:bg-sumi-700/40">
                <p className="text-sm text-sumi-700 dark:text-washi-100">
                  <FuriganaText segments={[{ base: word.example_jp, reading: '' }]} />
                </p>
                <p className="mt-1 text-[0.7rem] text-sumi-400">{word.example_meaning}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={() => onAnswer(false)}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200/60 bg-red-50/80 py-3 text-sm font-medium text-red-500 transition-all hover:bg-red-100 dark:border-red-700/40 dark:bg-red-700/20 dark:text-red-400"
        >
          <X className="h-4 w-4" /> 還不熟
        </button>
        <button
          onClick={() => onAnswer(true)}
          className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 py-3 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
        >
          <Check className="h-4 w-4" /> 會了！
        </button>
      </div>
    </div>
  );
}

function QuizView({
  word, options, index, total, quizAnswer, onAnswer, onNext, correctCount,
}: {
  word: WordWithProgress; options: string[]; index: number; total: number;
  quizAnswer: string | null; onAnswer: (a: string) => void; onNext: () => void; correctCount: number;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-sm text-sumi-400 transition-colors hover:text-sumi-600 dark:hover:text-washi-200"
        >
          <ChevronLeft className="h-4 w-4" /> 結束
        </button>
        <span className="text-sm font-medium text-sumi-500 dark:text-sumi-300">
          {index + 1} / {total} · 正解 {correctCount}
        </span>
      </div>
      <ProgressBar index={index} total={total} />

      {/* Question */}
      <div className="mt-6 rounded-2xl border border-washi-200/80 bg-gradient-to-br from-white to-washi-50 p-8 text-center shadow-soft-lg dark:border-sumi-700/60 dark:from-sumi-800 dark:to-sumi-900">
        <p className="text-xs font-medium uppercase tracking-wider text-matcha-500">這個單字的意思是？</p>
        <p className="mt-4 font-serif text-5xl font-bold text-sumi-800 dark:text-washi-100">
          <FuriganaText segments={[{ base: word.word, reading: '' }]} />
        </p>
        <button
          onClick={() => speakJapanese(word.word)}
          className="mt-4 flex items-center gap-1.5 rounded-full bg-matcha-50 px-3 py-1.5 text-xs font-medium text-matcha-600 transition-colors hover:bg-matcha-100 dark:bg-matcha-700/30 dark:text-matcha-300"
        >
          <Volume2 className="h-3 w-3" /> 聽發音
        </button>
      </div>

      {/* Options */}
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {options.map((opt) => {
          const isSelected = quizAnswer === opt;
          const isCorrect = opt === word.meaning;
          const showResult = quizAnswer !== null;
          return (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              disabled={showResult}
              className={`flex items-center justify-between rounded-xl border p-4 text-sm font-medium transition-all ${
                showResult
                  ? isCorrect
                    ? 'border-matcha-300 bg-matcha-50 text-matcha-700 dark:border-matcha-600 dark:bg-matcha-700/30 dark:text-matcha-200'
                    : isSelected
                      ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-700/40 dark:bg-red-700/20 dark:text-red-400'
                      : 'border-washi-200/80 bg-white/60 text-sumi-400 dark:border-sumi-700/60 dark:bg-sumi-700/30'
                  : 'border-washi-200/80 bg-white/80 text-sumi-700 hover:-translate-y-0.5 hover:border-matcha-300 hover:shadow-soft dark:border-sumi-700/60 dark:bg-sumi-800/80 dark:text-washi-100'
              }`}
            >
              <span className="font-serif">{opt}</span>
              {showResult && isCorrect && <Check className="h-4 w-4 text-matcha-500" />}
              {showResult && isSelected && !isCorrect && <X className="h-4 w-4 text-red-500" />}
            </button>
          );
        })}
      </div>

      {quizAnswer && (
        <button
          onClick={onNext}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 py-3 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
        >
          {index < total - 1 ? '下一題' : '看結果'} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ResultView({
  level, total, correct, onBack, onRetry,
}: {
  level: string; total: number; correct: number; onBack: () => void; onRetry: () => void;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : pct >= 40 ? '💪' : '📚';

  return (
    <div className="mx-auto max-w-md animate-scale-in">
      <div className="relative overflow-hidden rounded-2xl border border-washi-200/80 bg-gradient-to-br from-white to-washi-50 p-8 text-center shadow-soft-lg dark:border-sumi-700/60 dark:from-sumi-800 dark:to-sumi-900">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-matcha-100/50 blur-3xl dark:bg-matcha-700/20" />
        <div className="relative">
          <p className="text-5xl">{emoji}</p>
          <p className="mt-4 font-serif text-2xl font-bold text-sumi-800 dark:text-washi-100">
            {pct >= 80 ? '素晴らしい！' : pct >= 60 ? 'よくできました！' : 'もう少し！'}
          </p>
          <p className="mt-2 text-sm text-sumi-400">
            {level} · {total} 題中答對 {correct} 題
          </p>

          {/* Score ring */}
          <div className="relative mx-auto mt-6 h-32 w-32">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" strokeWidth="8" className="stroke-washi-200 dark:stroke-sumi-700" />
              <circle
                cx="64" cy="64" r="56" fill="none" strokeWidth="8" strokeLinecap="round"
                className="stroke-matcha-500 transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-3xl font-bold text-sumi-800 dark:text-washi-100">{pct}%</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onRetry}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 py-2.5 text-sm font-medium text-white shadow-soft transition-all hover:shadow-soft-lg"
            >
              <Shuffle className="h-3.5 w-3.5" /> 再複習一次
            </button>
            <button
              onClick={onBack}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-washi-200/80 bg-washi-50/80 py-2.5 text-sm font-medium text-sumi-600 transition-all hover:bg-matcha-50 dark:border-sumi-600/80 dark:bg-sumi-700/40 dark:text-washi-100"
            >
              <BarChart3 className="h-3.5 w-3.5" /> 回選單
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
