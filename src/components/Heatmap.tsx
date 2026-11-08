import { useMemo } from 'react';

const WEEKS = 52;
const DAYS = 7;

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

/** Deterministic pseudo-random level (0-4) for a given day index. */
function levelFor(i: number): number {
  const h = Math.sin(i * 9973) * 10000;
  const frac = h - Math.floor(h);
  // bias towards more activity
  if (frac < 0.35) return 0;
  if (frac < 0.55) return 1;
  if (frac < 0.75) return 2;
  if (frac < 0.9) return 3;
  return 4;
}

function dateLabel(i: number): string {
  const today = new Date();
  const totalDays = WEEKS * DAYS;
  const dayIndex = totalDays - 1 - i;
  const d = new Date(today);
  d.setDate(today.getDate() - dayIndex);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function Heatmap() {
  const cells = useMemo(() => {
    const total = WEEKS * DAYS;
    return Array.from({ length: total }, (_, i) => ({
      i,
      level: levelFor(i),
      date: dateLabel(i),
    }));
  }, []);

  // Group into columns of 7 (weeks). Index 0 is oldest.
  const columns: typeof cells[] = [];
  for (let w = 0; w < WEEKS; w++) {
    columns.push(cells.slice(w * DAYS, w * DAYS + DAYS));
  }

  const levelColors = [
    'bg-washi-100 dark:bg-sumi-700/80',
    'bg-matcha-200 dark:bg-matcha-700',
    'bg-matcha-300 dark:bg-matcha-600',
    'bg-matcha-400 dark:bg-matcha-500',
    'bg-matcha-500 dark:bg-matcha-400',
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="mb-1.5 flex gap-[3px] pl-6 text-[0.6rem] text-sumi-400 dark:text-sumi-400">
          {columns.map((_, ci) => {
            const totalDays = WEEKS * DAYS;
            const dayIndex = totalDays - 1 - (ci * DAYS);
            const d = new Date();
            d.setDate(new Date().getDate() - dayIndex);
            const isMonthStart = d.getDate() <= 7;
            return (
              <span key={ci} className="w-2.5 text-center leading-none">
                {isMonthStart ? MONTH_LABELS[d.getMonth()] : ''}
              </span>
            );
          })}
        </div>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] pr-1 text-[0.6rem] text-sumi-400 dark:text-sumi-400">
            {DAY_LABELS.map((d, i) => (
              <span key={d} className="h-2.5 leading-none">{i % 2 === 1 ? d : ''}</span>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-[3px]">
            {columns.map((col, ci) => (
              <div key={ci} className="flex flex-col gap-[3px]">
                {col.map((cell) => (
                  <div
                    key={cell.i}
                    title={`${cell.date}  —  ${cell.level === 0 ? '休息' : `${cell.level * 12 + 5} 語`}`}
                    className={`h-2.5 w-2.5 rounded-[3px] transition-transform hover:scale-125 hover:ring-1 hover:ring-matcha-300 ${levelColors[cell.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
