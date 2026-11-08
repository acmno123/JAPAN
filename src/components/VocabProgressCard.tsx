import { NotebookPen, ChevronRight, Check } from 'lucide-react';

const levels = [
  { name: 'N5', progress: 100, color: 'from-matcha-400 to-matcha-500', text: 'text-matcha-600 dark:text-matcha-300', done: true },
  { name: 'N4', progress: 78, color: 'from-matcha-300 to-matcha-500', text: 'text-matcha-600 dark:text-matcha-300', done: false },
  { name: 'N3', progress: 45, color: 'from-wood-300 to-wood-500', text: 'text-wood-500 dark:text-wood-200', done: false },
  { name: 'N2', progress: 12, color: 'from-sumi-400 to-sumi-500', text: 'text-sumi-500 dark:text-sumi-300', done: false },
];

interface VocabProgressCardProps {
  onOpenNotebook: () => void;
}

export function VocabProgressCard({ onOpenNotebook }: VocabProgressCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-washi-200/80 bg-white/80 p-5 shadow-soft backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sumi-300/60 hover:shadow-soft-lg dark:border-sumi-700/60 dark:bg-sumi-800/80 dark:hover:border-sumi-500/40">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sumi-100/50 blur-2xl transition-all duration-500 group-hover:scale-150 dark:bg-sumi-700/30" />
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sumi-700 to-sumi-800 text-washi-100 shadow-soft dark:from-washi-100 dark:to-washi-200 dark:text-sumi-800">
            <NotebookPen className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[0.625rem] font-bold tracking-widest text-sumi-500 dark:text-sumi-400">C</span>
            <h3 className="font-serif text-base font-semibold leading-tight text-sumi-800 dark:text-washi-100">
              智慧生詞與錯題本
            </h3>
          </div>
        </div>
        <p className="mt-2 text-xs text-sumi-400 dark:text-sumi-400">JLPT 單字掌握進度</p>

        <div className="mt-5 flex-1 space-y-4">
          {levels.map((lv) => (
            <button
              key={lv.name}
              onClick={onOpenNotebook}
              className="group/lv block w-full text-left"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-sumi-700 dark:text-washi-100">
                  <span className="flex h-5 w-8 items-center justify-center rounded-md bg-washi-100 text-[0.65rem] font-bold text-sumi-500 dark:bg-sumi-700 dark:text-sumi-300">
                    {lv.name}
                  </span>
                  {lv.done && <Check className="h-3.5 w-3.5 text-matcha-500" />}
                </span>
                <span className={`text-xs font-semibold ${lv.text}`}>{lv.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-washi-100 dark:bg-sumi-700/80">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${lv.color} transition-all duration-700 ease-out`}
                  style={{ width: `${lv.progress}%` }}
                />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onOpenNotebook}
          className="group/btn mt-5 flex items-center justify-between rounded-xl border border-washi-200/80 bg-washi-50/80 px-4 py-2.5 text-sm font-medium text-sumi-600 transition-all hover:bg-matcha-50 hover:text-matcha-600 dark:border-sumi-600/80 dark:bg-sumi-700/40 dark:text-washi-100 dark:hover:bg-matcha-700/30"
        >
          <span>查看錯題本（12 題待複習）</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
