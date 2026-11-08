import { Mic, Flame, TrendingUp, BookOpen, Calendar } from 'lucide-react';
import { Heatmap } from '@/components/Heatmap';

interface HeroAnalyticsProps {
  wordsToday: number;
  minutesToday: number;
  streak: number;
}

export function HeroAnalytics({ wordsToday, minutesToday, streak }: HeroAnalyticsProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 sm:pt-14">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-matcha-200/60 bg-matcha-50/80 px-3 py-1 text-xs font-medium text-matcha-600 dark:border-matcha-700/50 dark:bg-matcha-700/20 dark:text-matcha-300">
          <Calendar className="h-3 w-3" />
          {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-sumi-800 dark:text-washi-100 sm:text-4xl lg:text-5xl">
          今日も一緒に
          <span className="relative ml-2 inline-block">
            <span className="relative z-10">学びましょう</span>
            <span className="absolute bottom-1 left-0 z-0 h-3 w-full rounded bg-matcha-200/60 dark:bg-matcha-700/40" />
          </span>
        </h1>
        <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-sumi-400 dark:text-sumi-300">
          AI があなたのペースに合わせて、日本語の読み書き・会話をサポートします。
        </p>
      </div>

      {/* Stats + heatmap grid */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Stat cards column */}
        <div className="flex flex-col gap-4">
          <StatCard
            label="今日の単語"
            value={wordsToday}
            unit="語"
            trend="+12%"
            accent="matcha"
            icon={<BookOpen className="h-4 w-4" />}
          />
          <StatCard
            label="会話練習"
            value={minutesToday}
            unit="分"
            trend="+5%"
            accent="wood"
            icon={<Mic className="h-4 w-4" />}
          />
          <StatCard
            label="連続日数"
            value={streak}
            unit="日"
            trend="best!"
            accent="flame"
            icon={<Flame className="h-4 w-4" />}
          />
        </div>

        {/* Heatmap */}
        <div className="relative overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm transition-colors dark:border-sumi-700/60 dark:bg-sumi-800/80 lg:col-span-2">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-matcha-100/40 blur-3xl dark:bg-matcha-700/10" />
          <div className="relative mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-semibold text-sumi-800 dark:text-washi-100">
                学習記録
              </h2>
              <p className="mt-0.5 text-xs text-sumi-400 dark:text-sumi-400">
                過去 1 年間の毎日の学習状況 · <span className="font-semibold text-matcha-600 dark:text-matcha-300">1,284 語</span> 学習済み
              </p>
            </div>
            <div className="hidden items-center gap-1.5 text-[0.65rem] text-sumi-400 sm:flex dark:text-sumi-400">
              <span>少</span>
              <HeatmapDot level={0} />
              <HeatmapDot level={1} />
              <HeatmapDot level={2} />
              <HeatmapDot level={3} />
              <HeatmapDot level={4} />
              <span>多</span>
            </div>
          </div>
          <Heatmap />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
  trend,
  accent,
  icon,
}: {
  label: string;
  value: number;
  unit: string;
  trend: string;
  accent: 'matcha' | 'wood' | 'flame';
  icon: React.ReactNode;
}) {
  const accentMap = {
    matcha: {
      icon: 'bg-gradient-to-br from-matcha-400 to-matcha-500 text-white',
      glow: 'group-hover:bg-matcha-100/60 dark:group-hover:bg-matcha-700/20',
    },
    wood: {
      icon: 'bg-gradient-to-br from-wood-300 to-wood-500 text-white',
      glow: 'group-hover:bg-wood-100/60 dark:group-hover:bg-wood-500/20',
    },
    flame: {
      icon: 'bg-gradient-to-br from-wood-400 to-wood-500 text-white',
      glow: 'group-hover:bg-washi-100 dark:group-hover:bg-sumi-700/40',
    },
  };
  const a = accentMap[accent];
  return (
    <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-4 shadow-soft backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80">
      <div className={`absolute inset-0 -z-10 bg-transparent transition-colors duration-300 ${a.glow}`} />
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-soft ${a.icon}`}>
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-xs font-medium text-sumi-400 dark:text-sumi-400">{label}</p>
        <p className="mt-0.5 font-serif text-2xl font-bold text-sumi-800 dark:text-washi-100">
          {value}
          <span className="ml-1 text-sm font-normal text-sumi-400">{unit}</span>
        </p>
      </div>
      <span className="flex items-center gap-0.5 rounded-full bg-matcha-50 px-2 py-0.5 text-[0.65rem] font-semibold text-matcha-600 dark:bg-matcha-700/30 dark:text-matcha-300">
        <TrendingUp className="h-2.5 w-2.5" /> {trend}
      </span>
    </div>
  );
}

function HeatmapDot({ level }: { level: number }) {
  const colors = [
    'bg-washi-100 dark:bg-sumi-700',
    'bg-matcha-200 dark:bg-matcha-700',
    'bg-matcha-300 dark:bg-matcha-600',
    'bg-matcha-400 dark:bg-matcha-500',
    'bg-matcha-500 dark:bg-matcha-400',
  ];
  return <span className={`h-2.5 w-2.5 rounded-[3px] ${colors[level]}`} />;
}
