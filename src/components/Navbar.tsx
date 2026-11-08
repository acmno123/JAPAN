import { useState } from 'react';
import { BookOpen, ChevronDown, LogOut, Moon, Sun, Type, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFurigana } from '@/context/FuriganaContext';
import { useTheme } from '@/context/ThemeContext';

interface NavbarProps {
  streak: number;
  onAuthClick: () => void;
}

const navItems = [
  { label: '首頁', target: 'home' },
  { label: '核心功能', target: 'features' },
  { label: 'JLPT 複習', target: 'review' },
  { label: '世界地圖', target: 'countries' },
  { label: '每日一句', target: 'daily' },
];

export function Navbar({ streak, onAuthClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { show, toggle } = useFurigana();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-washi-200/70 bg-washi-50/85 backdrop-blur-xl dark:border-sumi-700/70 dark:bg-sumi-900/85">
      <nav className="mx-auto flex min-h-16 max-w-[1650px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8" aria-label="主導覽">
        <button onClick={() => scrollTo('home')} className="group flex shrink-0 items-center gap-2.5 text-left" aria-label="回到首頁">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-matcha-400 to-matcha-600 font-serif text-lg text-white shadow-soft transition group-hover:-rotate-6">あ</span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-serif text-base font-bold text-sumi-800 dark:text-washi-100">AI-Nihongo</span>
            <span className="text-[9px] tracking-[0.2em] text-matcha-600 dark:text-matcha-400">AI・日本語</span>
          </span>
        </button>

        <div className="hidden items-center gap-0.5 rounded-full border border-washi-200/80 bg-white/70 p-1 shadow-soft lg:flex">
          {navItems.map((item) => (
            <button key={item.target} onClick={() => scrollTo(item.target)} className="rounded-full px-3 py-1.5 text-xs font-medium text-sumi-500 transition hover:bg-matcha-50 hover:text-matcha-700 dark:text-sumi-300 dark:hover:bg-sumi-700 dark:hover:text-matcha-300">
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <span className="hidden items-center gap-1 rounded-full border border-matcha-200/80 bg-matcha-50 px-2.5 py-1.5 text-xs font-semibold text-matcha-700 sm:flex dark:border-matcha-700/60 dark:bg-matcha-900/20 dark:text-matcha-300" aria-label={`連續學習 ${streak} 天`}>
            🔥 {streak}<span className="font-normal">日</span>
          </span>
          <button onClick={toggle} role="switch" aria-checked={show} aria-label="切換振假名顯示" title="振假名顯示／隱藏" className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${show ? 'border-matcha-300 bg-matcha-50 text-matcha-700' : 'border-washi-200 bg-white/70 text-sumi-500'} dark:border-sumi-700 dark:bg-sumi-800 dark:text-sumi-200`}>
            <Type className="h-4 w-4" />
          </button>
          <button onClick={toggleTheme} aria-label="切換深色模式" className="flex h-9 w-9 items-center justify-center rounded-full border border-washi-200 bg-white/70 text-sumi-500 transition hover:text-matcha-600 dark:border-sumi-700 dark:bg-sumi-800 dark:text-sumi-200">
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <div className="relative">
            <button onClick={() => user ? setMenuOpen((open) => !open) : onAuthClick()} aria-label={user ? '開啟帳號選單' : '登入'} className="flex h-9 items-center gap-1 rounded-full border border-washi-200 bg-white/70 px-1.5 text-sumi-600 transition hover:border-matcha-300 dark:border-sumi-700 dark:bg-sumi-800 dark:text-washi-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-wood-300 to-wood-500 text-white">
                {user ? <span className="text-xs font-bold">{user.email?.[0]?.toUpperCase()}</span> : <User className="h-4 w-4" />}
              </span>
              {user ? <ChevronDown className="mr-1 h-3.5 w-3.5" /> : <span className="hidden px-1 text-xs sm:inline">登入</span>}
            </button>

            {user && menuOpen && (
              <>
                <button className="fixed inset-0 z-40 cursor-default" aria-label="關閉帳號選單" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-washi-200 bg-washi-50 p-2 shadow-soft-lg dark:border-sumi-700 dark:bg-sumi-800">
                  <div className="border-b border-washi-200 px-3 py-2 dark:border-sumi-700">
                    <p className="text-[11px] text-sumi-400">已登入</p>
                    <p className="truncate text-sm font-medium text-sumi-700 dark:text-washi-100">{user.email}</p>
                  </div>
                  <button onClick={() => { void signOut(); setMenuOpen(false); }} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-sumi-600 hover:bg-red-50 hover:text-red-600 dark:text-sumi-200 dark:hover:bg-red-950/30">
                    <LogOut className="h-4 w-4" />登出
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex gap-1 overflow-x-auto border-t border-washi-200/50 px-3 py-2 lg:hidden scrollbar-thin dark:border-sumi-700/50">
        {navItems.map((item) => (
          <button key={item.target} onClick={() => scrollTo(item.target)} className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-sumi-500 hover:bg-matcha-50 dark:text-sumi-300">
            {item.label}
          </button>
        ))}
        <span className="ml-auto flex shrink-0 items-center gap-1 px-2 text-xs font-semibold text-matcha-700 dark:text-matcha-300">
          <BookOpen className="h-3.5 w-3.5" />{streak}日
        </span>
      </div>
    </header>
  );
}
