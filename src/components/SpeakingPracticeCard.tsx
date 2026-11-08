import { Mic, Store, UtensilsCrossed, TrainFront, Coffee, ArrowRight } from 'lucide-react';

export type ScenarioKey = 'izakaya' | 'convenience' | 'station' | 'cafe';

const scenarios: { key: ScenarioKey; label: string; jp: string; icon: typeof Store; color: string }[] = [
  { key: 'izakaya', label: '居酒屋点餐', jp: '居酒屋', icon: UtensilsCrossed, color: 'from-matcha-400 to-matcha-500' },
  { key: 'convenience', label: '超商結帳', jp: 'コンビニ', icon: Store, color: 'from-wood-300 to-wood-500' },
  { key: 'station', label: '車站問路', jp: '駅', icon: TrainFront, color: 'from-sumi-500 to-sumi-700' },
  { key: 'cafe', label: '咖啡閒聊', jp: 'カフェ', icon: Coffee, color: 'from-wood-400 to-wood-500' },
];

interface SpeakingPracticeCardProps {
  onSelect: (key: ScenarioKey) => void;
}

export function SpeakingPracticeCard({ onSelect }: SpeakingPracticeCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-wood-300/60 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80 dark:hover:border-wood-400/40">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-wood-100/60 blur-2xl transition-all duration-500 group-hover:scale-150 dark:bg-wood-500/15" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wood-300 to-wood-500 text-white shadow-soft">
            <Mic className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[0.625rem] font-bold tracking-widest text-wood-500 dark:text-wood-400">B</span>
            <h3 className="font-serif text-base font-semibold leading-tight text-sumi-800 dark:text-washi-100">
              AI 情境口語陪練
            </h3>
          </div>
        </div>
        <p className="mt-2 text-xs text-sumi-400 dark:text-sumi-400">選擇情境，開始真人對話練習</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => onSelect(s.key)}
                className="group/s flex flex-col items-start gap-2.5 rounded-xl border border-washi-200/80 bg-washi-50/80 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-matcha-300 hover:shadow-soft dark:border-sumi-600/60 dark:bg-sumi-700/40"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white shadow-soft transition-transform group-hover/s:scale-110`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-sumi-700 dark:text-washi-100">{s.label}</span>
                  <span className="text-[0.65rem] text-sumi-400 dark:text-sumi-400">{s.jp}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onSelect('izakaya')}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-washi-200/80 bg-washi-50/80 px-4 py-2.5 text-sm font-medium text-sumi-600 transition-all hover:border-wood-300 hover:bg-wood-50 hover:text-wood-500 dark:border-sumi-600/80 dark:bg-sumi-700/40 dark:text-washi-100 dark:hover:bg-wood-500/20"
        >
          <Mic className="h-4 w-4" /> 開始陪練
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
