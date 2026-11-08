import { Moon, Sun, User, ChevronDown, BookOpen, Type, LogOut, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useFurigana } from '@/context/FuriganaContext';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  streak: number;
  onAuthClick: () => void;
}

export function Navbar({ streak, onAuthClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { show, toggle } = useFurigana();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: '首頁', target: 'home' },
    { label: '核心功能', target: 'features' },
    { label: 'JLPT 複習', target: 'review' },
    { label: '世界地圖', target: 'countries' },
    { label: '每日一句', target: 'daily' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAvatar = () => {
    if (user) {
      setMenuOpen((o) => !o);
    } else {
      onAuthClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-washi-200/60 bg-washi-50/70 backdrop-blur-xl dark:border-sumi-700/50 dark:bg-sumi-900/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2.5" onClick={() => scrollTo('home')}>
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-soft transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.8L20 10l-5 3.6L16.5 20 12 16.5 7.5 20 9 13.6 4 10l6.1-1.2z" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-bold tracking-tight text-sumi-800 dark:text-washi-100">
              AI-Nihongo
            </span>
            <span className="mt-0.5 text-[0.625rem] tracking-[0.2em] text-matcha-500 dark:text-matcha-400">AI・日本語</span>
          </span>
        </a>

        {/* Center nav */}
        <div className="hidden items-center gap-0.5 rounded-full border border-washi-200/70 bg-white/60 p-1 shadow-soft md:flex dark:border-sumi-700/60 dark:bg-sumi-800/60">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollTo(item.target)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                item.target === 'home'
                  ? 'bg-gradient-to-br from-matcha-400 to-matcha-500 text-white shadow-soft'
                  : 'text-sumi-400 hover:text-sumi-700 dark:text-sumi-300 dark:hover:text-washi-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Streak pill */}
          <div className="hidden items-center gap-1.5 rounded-full border border-matcha-200/60 bg-matcha-50 px-3 py-1.5 text-xs font-semibold text-matcha-600 sm:flex dark:border-matcha-700/50 dark:bg-matcha-700/20 dark:text-matcha-300">
            <span className="text-sm">🔥</span>
            <span>{streak}<span className="ml-0.5 font-normal text-matcha-500 dark:text-matcha-400">日</span></span>
          </div>

          {/* Furigana toggle */}
          <button
            onClick={toggle}
            role="switch"
            aria-checked={show}
            aria-label="切換振假名顯示"
            title="振假名 顯示 / 隱藏"
            className="group flex items-center gap-2 rounded-full border border-washi-200/80 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-sumi-500 transition-all hover:border-matcha-300 hover:shadow-soft dark:border-sumi-700/80 dark:bg-sumi-800/70 dark:text-sumi-300"
          >
            <Type className="h-3.5 w-3.5 text-sumi-400 transition-colors group-hover:text-matcha-500" />
            <span className={`relative h-4 w-7 rounded-full transition-colors duration-200 ${show ? 'bg-matcha-400' : 'bg-sumi-200 dark:bg-sumi-600'}`}>
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  show ? 'translate-x-3.5' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label="切換深色模式"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-washi-200/80 bg-white/70 text-sumi-500 transition-all hover:scale-105 hover:text-matcha-500 dark:border-sumi-700/80 dark:bg-sumi-800/70 dark:text-sumi-300 dark:hover:text-matcha-300"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Avatar / Auth */}
          <div className="relative">
            <button
              onClick={handleAvatar}
              className="group flex items-center gap-1.5 rounded-full border border-washi-200/80 bg-white/70 p-0.5 pr-1.5 transition-all hover:shadow-soft dark:border-sumi-700/80 dark:bg-sumi-800/70"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-wood-300 to-wood-500 text-white">
                {user ? (
                  <span className="text-xs font-bold">{user.email?.[0]?.toUpperCase()}</span>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </span>
              {user ? (
                <ChevronDown className="hidden h-3.5 w-3.5 text-sumi-400 transition-transform group-hover:translate-y-0.5 sm:block" />
              ) : (
                <span className="hidden text-xs font-medium text-matcha-600 dark:text-matcha-400 sm:block">登入</span>
              )}
            </button>

            {/* User dropdown */}
            {user && menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-56 animate-scale-in rounded-xl border border-washi-200/80 bg-washi-50 p-2 shadow-soft-lg dark:border-sumi-700 dark:bg-sumi-800">
                  <div className="border-b border-washi-200/80 px-3 py-2.5 dark:border-sumi-700/60">
                    <p className="text-xs font-medium text-sumi-400">已登入</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-sumi-700 dark:text-washi-100">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sumi-600 transition-colors hover:bg-red-50 hover:text-red-500 dark:text-washi-100 dark:hover:bg-red-700/20"
                  >
                    <LogOut className="h-4 w-4" /> 登出
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="flex items-center gap-0.5 overflow-x-auto border-t border-washi-200/50 px-4 py-2 md:hidden scrollbar-thin dark:border-sumi-700/50">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollTo(item.target)}
            className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
              item.target === 'home'
                ? 'bg-matcha-500 text-white'
                : 'text-sumi-400 dark:text-sumi-300'
            }`}
          >
            {item.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-xs text-matcha-600 dark:text-matcha-400">
          <BookOpen className="h-3.5 w-3.5" />
          <span className="font-semibold">{streak}日</span>
        </div>
      </div>
    </header>
  );
}
