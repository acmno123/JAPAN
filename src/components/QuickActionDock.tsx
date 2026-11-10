import { BookOpenCheck, Flame, Map, NotebookPen, Sparkles, Target } from 'lucide-react';

interface QuickActionDockProps {
  streak: number;
  onStartPractice: () => void;
  onOpenNotebook: () => void;
  onScrollTo: (target: string) => void;
}

export function QuickActionDock({ streak, onStartPractice, onOpenNotebook, onScrollTo }: QuickActionDockProps) {
  const actions = [
    { label: '開始口說', hint: '立即進入情境', icon: Sparkles, onClick: onStartPractice, featured: true },
    { label: '錯題本', hint: '複習薄弱點', icon: NotebookPen, onClick: onOpenNotebook },
    { label: 'JLPT 挑戰', hint: '測試目前程度', icon: Target, onClick: () => onScrollTo('infinite-practice') },
    { label: '探索日本', hint: '用文化記憶單字', icon: Map, onClick: () => onScrollTo('countries') },
  ];

  return (
    <section className="section-shell pt-5 sm:pt-7" aria-labelledby="quick-actions-title">
      <div className="glass-panel rounded-[26px] p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 px-2 lg:min-w-[220px]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-glow">
              <BookOpenCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-matcha-600 dark:text-matcha-300">Quick actions</p>
              <h2 id="quick-actions-title" className="font-serif text-lg font-bold text-sumi-800 dark:text-washi-100">今天要練什麼？</h2>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
            {actions.map(({ label, hint, icon: Icon, onClick, featured }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={`group flex min-h-[72px] items-center gap-2 rounded-2xl border px-3 py-2 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-offset-2 ${featured ? 'border-matcha-400 bg-gradient-to-br from-matcha-500 to-matcha-600 text-white shadow-glow' : 'border-washi-200/80 bg-white/65 text-sumi-700 hover:border-matcha-300 hover:bg-matcha-50/80 dark:border-sumi-700 dark:bg-sumi-800/65 dark:text-washi-100 dark:hover:bg-sumi-700'}`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition group-hover:scale-110 ${featured ? 'text-white' : 'text-matcha-500'}`} />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">{label}</span>
                  <span className={`mt-0.5 block truncate text-[10px] ${featured ? 'text-matcha-50' : 'text-sumi-400 dark:text-sumi-400'}`}>{hint}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 border-l border-washi-200 px-3 text-right dark:border-sumi-700 lg:flex">
            <Flame className="h-4 w-4 text-wood-500" />
            <div>
              <p className="text-[10px] text-sumi-400">目前連續</p>
              <p className="font-serif text-lg font-bold text-sumi-800 dark:text-washi-100">{streak} 日</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
