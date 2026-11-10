import { ArrowUpRight, BookOpenCheck, Flame, Headphones, Map, NotebookPen, Sparkles, Target } from 'lucide-react';

interface QuickActionDockProps {
  streak: number;
  onStartPractice: () => void;
  onOpenNotebook: () => void;
  onScrollTo: (target: string) => void;
}

export function QuickActionDock({ streak, onStartPractice, onOpenNotebook, onScrollTo }: QuickActionDockProps) {
  const actions = [
    { label: '口說實戰', hint: '情境對話', icon: Headphones, onClick: onStartPractice, featured: true },
    { label: '錯題本', hint: '精準補強', icon: NotebookPen, onClick: onOpenNotebook, featured: false },
    { label: 'JLPT 挑戰', hint: '立即測驗', icon: Target, onClick: () => onScrollTo('infinite-practice'), featured: false },
    { label: '日本探索', hint: '文化學單字', icon: Map, onClick: () => onScrollTo('countries'), featured: false },
  ];

  return (
    <section className="section-shell pt-5 sm:pt-7" aria-labelledby="quick-actions-title">
      <div className="neo-rail rounded-[28px] p-3 sm:p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 px-2 lg:min-w-[245px]">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-sumi-900 text-white shadow-[0_0_0_5px_rgba(111,160,105,.12),0_10px_30px_rgba(31,30,28,.22)] dark:bg-matcha-500">
              <BookOpenCheck className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-matcha-400 dark:border-sumi-800" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-matcha-600 dark:text-matcha-300">Learning command</p>
              <h2 id="quick-actions-title" className="mt-0.5 font-serif text-lg font-bold text-sumi-800 dark:text-washi-100">今天，先完成一件事</h2>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
            {actions.map(({ label, hint, icon: Icon, onClick, featured }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={`neo-action group flex min-h-[76px] items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition duration-300 focus-visible:outline-offset-2 ${featured ? 'neo-action-featured border-sumi-900 bg-sumi-900 text-white shadow-[0_14px_35px_rgba(31,30,28,.22)] hover:bg-sumi-800 dark:border-matcha-400 dark:bg-matcha-500 dark:hover:bg-matcha-400' : 'border-washi-200/80 bg-white/60 text-sumi-700 hover:border-matcha-300 hover:bg-white dark:border-sumi-700 dark:bg-sumi-800/70 dark:text-washi-100 dark:hover:border-matcha-600 dark:hover:bg-sumi-700'}`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 transition duration-300 group-hover:scale-110 ${featured ? 'text-matcha-300 dark:text-white' : 'text-matcha-500'}`} />
                  <span className="min-w-0"><span className="block truncate text-xs font-bold">{label}</span><span className={`mt-1 block truncate text-[10px] ${featured ? 'text-sumi-200 dark:text-matcha-50' : 'text-sumi-400 dark:text-sumi-400'}`}>{hint}</span></span>
                </span>
                <ArrowUpRight className={`h-3.5 w-3.5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${featured ? 'text-matcha-300 dark:text-white' : 'text-sumi-300 dark:text-sumi-500'}`} />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-washi-200/80 px-2 pt-3 dark:border-sumi-700 lg:block lg:min-w-[92px] lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 lg:text-right">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sumi-400 dark:text-sumi-500"><Flame className="h-3.5 w-3.5 text-wood-500" /> Streak</span>
            <span className="mt-0.5 block font-serif text-xl font-bold text-sumi-800 dark:text-washi-100">{streak}<small className="ml-1 text-xs font-normal text-sumi-400">日</small></span>
          </div>
        </div>
      </div>
    </section>
  );
}
