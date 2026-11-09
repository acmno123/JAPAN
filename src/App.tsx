import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { FuriganaProvider } from '@/context/FuriganaContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { HeroAnalytics } from '@/components/HeroAnalytics';
import { SentenceBreakdownCard } from '@/components/SentenceBreakdownCard';
import { SpeakingPracticeCard, type ScenarioKey } from '@/components/SpeakingPracticeCard';
import { VocabProgressCard } from '@/components/VocabProgressCard';
import { DailyRecommended } from '@/components/DailyRecommended';
import { CountryExplorer } from '@/components/CountryExplorer';
import { JlptReview } from '@/components/JlptReview';
import { JlptInfinitePractice } from '@/components/JlptInfinitePractice';
import { SpeakingPracticeModal } from '@/components/SpeakingPracticeModal';
import { ErrorNotebookModal } from '@/components/ErrorNotebookModal';
import { AuthModal } from '@/components/AuthModal';
import { LandingPage } from '@/components/LandingPage';

const DASHBOARD_STORAGE_KEY = 'ai-nihongo-dashboard-visited';

function App() {
  const streak = 42;
  const wordsToday = 28;
  const minutesToday = 15;

  const [speakingOpen, setSpeakingOpen] = useState(false);
  const [speakingScenario, setSpeakingScenario] = useState<ScenarioKey | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(() => {
    try {
      return window.localStorage.getItem(DASHBOARD_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const openScenario = (key: ScenarioKey) => {
    setSpeakingScenario(key);
    setSpeakingOpen(true);
  };

  const openDashboard = () => {
    setShowDashboard(true);
    try {
      window.localStorage.setItem(DASHBOARD_STORAGE_KEY, 'true');
    } catch {
      // Ignore browser storage issues.
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <FuriganaProvider>
          {showDashboard ? (
            <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(116,145,112,0.14),transparent_40%),linear-gradient(180deg,#f9f6f1_0%,#f4efe7_100%)] text-sumi-700 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_top,_rgba(79,132,73,0.12),transparent_35%),linear-gradient(180deg,#131312_0%,#1f1e1c_100%)] dark:text-washi-100">
              <div className="pointer-events-none fixed inset-0 z-0 opacity-80" aria-hidden>
                <div className="absolute -top-28 right-0 h-[30rem] w-[30rem] rounded-full bg-matcha-100/60 blur-[110px] dark:bg-matcha-700/20" />
                <div className="absolute -left-20 top-1/4 h-[28rem] w-[28rem] rounded-full bg-wood-100/80 blur-[120px] dark:bg-wood-500/10" />
                <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full bg-washi-200/80 blur-[120px] dark:bg-sumi-700/20" />
                <div
                  className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(92,90,83,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(92,90,83,0.6) 1px, transparent 1px)',
                    backgroundSize: '38px 38px',
                  }}
                />
              </div>

              <div className="relative z-10 mx-auto max-w-[1680px]">
                <Navbar streak={streak} onAuthClick={() => setAuthOpen(true)} />
                <main className="pb-20">
                  <div className="section-shell mt-5 sm:mt-7">
                    <div className="micro-badge">
                      <span className="h-2 w-2 rounded-full bg-matcha-500 shadow-[0_0_12px_rgba(79,132,73,0.7)]" />
                      今日學習任務 · 15 分鐘
                    </div>
                  </div>

                  <div id="home" className="section-shell pt-4 sm:pt-6">
                    <div className="rounded-[30px] border border-white/30 bg-white/65 p-4 shadow-[0_16px_55px_rgba(39,53,45,0.09)] backdrop-blur-xl dark:border-sumi-700/60 dark:bg-sumi-800/65">
                      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[26px] bg-gradient-to-br from-[#f1efe8] via-white to-[#e8eee4] p-5 sm:p-7 dark:from-sumi-800 dark:via-sumi-800 dark:to-sumi-900">
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-matcha-200 bg-matcha-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-matcha-700 dark:border-matcha-700/60 dark:bg-matcha-900/20 dark:text-matcha-300">
                              <span className="h-2 w-2 rounded-full bg-matcha-500" />
                              Today’s focus
                            </span>
                            <span className="rounded-full border border-sumi-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-sumi-500 dark:border-sumi-600 dark:bg-sumi-700/50 dark:text-sumi-300">
                              目標 15 分鐘
                            </span>
                          </div>

                          <h1 className="max-w-xl font-serif text-3xl leading-tight tracking-[-0.06em] text-sumi-800 dark:text-washi-100 sm:text-5xl">
                            專屬於你的日語進步節奏
                          </h1>

                          <p className="mt-4 max-w-xl text-sm leading-7 text-sumi-500 dark:text-sumi-300 sm:text-base">
                            從日常句子、接待場景到 JLPT 挑戰，AI 會陪你在每一個關鍵點上建立語感與自信。
                          </p>

                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => openScenario('izakaya')}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-sumi-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(31,30,28,0.18)] transition hover:-translate-y-0.5 dark:bg-white dark:text-sumi-900"
                            >
                              開始練習
                            </button>
                            <button
                              onClick={() => setNotebookOpen(true)}
                              className="inline-flex items-center justify-center gap-2 rounded-full border border-sumi-200 bg-white/80 px-5 py-3 text-sm font-medium text-sumi-700 transition hover:border-matcha-300 hover:text-matcha-700 dark:border-sumi-700 dark:bg-sumi-800/80 dark:text-washi-100"
                            >
                              查看錯題本
                            </button>
                          </div>

                          <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {[
                              { label: '單字總數', value: '1,284' },
                              { label: '連續天數', value: `${streak}天` },
                              { label: '本週完成', value: '84%' },
                            ].map((item) => (
                              <div key={item.label} className="rounded-2xl border border-sumi-200/70 bg-white/70 p-3.5 dark:border-sumi-700 dark:bg-sumi-800/70">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-sumi-400 dark:text-sumi-500">{item.label}</p>
                                <p className="mt-2 font-serif text-2xl text-sumi-700 dark:text-washi-100">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[26px] border border-sumi-200/70 bg-[#fbfaf8] p-4 shadow-inner shadow-white/70 dark:border-sumi-700 dark:bg-sumi-800/80">
                          <div className="mb-4 flex items-center justify-between">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sumi-400 dark:text-sumi-500">Progress</p>
                              <p className="mt-1 font-serif text-2xl text-sumi-800 dark:text-washi-100">今日學習</p>
                            </div>
                            <div className="rounded-full border border-matcha-200 bg-matcha-50 px-2.5 py-1 text-xs font-medium text-matcha-700 dark:border-matcha-700/50 dark:bg-matcha-900/20 dark:text-matcha-300">
                              +12%
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="rounded-2xl bg-gradient-to-br from-[#ecf3e8] via-white to-[#f3eadc] p-4 dark:from-sumi-800 dark:via-sumi-800 dark:to-sumi-900">
                              <div className="flex items-center justify-between text-xs text-sumi-500 dark:text-sumi-300">
                                <span>閱讀理解</span>
                                <span>78%</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sumi-200/80 dark:bg-sumi-700">
                                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-matcha-400 to-matcha-600" />
                              </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-[#f6f1e8] via-white to-[#eef2ea] p-4 dark:from-sumi-800 dark:via-sumi-800 dark:to-sumi-900">
                              <div className="flex items-center justify-between text-xs text-sumi-500 dark:text-sumi-300">
                                <span>口說練習</span>
                                <span>64%</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sumi-200/80 dark:bg-sumi-700">
                                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-wood-300 to-wood-500" />
                              </div>
                            </div>

                            <div className="rounded-2xl bg-gradient-to-br from-[#eef4ee] via-white to-[#f8f2ef] p-4 dark:from-sumi-800 dark:via-sumi-800 dark:to-sumi-900">
                              <div className="flex items-center justify-between text-xs text-sumi-500 dark:text-sumi-300">
                                <span>單字記憶</span>
                                <span>91%</span>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sumi-200/80 dark:bg-sumi-700">
                                <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-[#9bbf97] to-[#4f8449]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <section className="section-shell pt-14" id="features">
                    <div className="mb-7 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium tracking-[0.26em] text-matcha-600 dark:text-matcha-300">CORE FEATURES</p>
                        <h2 className="mt-2 font-serif text-3xl tracking-tight text-sumi-800 dark:text-washi-100 sm:text-4xl">
                          讓學習更像一段有節奏的生活
                        </h2>
                      </div>
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-sumi-300 to-transparent dark:via-sumi-700 sm:block" />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      <SentenceBreakdownCard />
                      <SpeakingPracticeCard onSelect={openScenario} />
                      <VocabProgressCard onOpenNotebook={() => setNotebookOpen(true)} />
                    </div>
                  </section>

                  <JlptInfinitePractice />
                  <JlptReview />
                  <CountryExplorer />
                  <div id="daily" />
                  <DailyRecommended />

                  <footer className="section-shell mt-20">
                    <div className="flex flex-col items-center gap-3 border-t border-washi-200/70 pt-8 dark:border-sumi-700/60">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-soft">
                          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3l1.9 5.8L20 10l-5 3.6L16.5 20 12 16.5 7.5 20 9 13.6 4 10l6.1-1.2z" />
                          </svg>
                        </span>
                        <span className="font-serif text-sm font-bold text-sumi-700 dark:text-washi-100">AI-Nihongo</span>
                      </div>
                      <p className="text-center text-xs text-sumi-400 dark:text-sumi-500">
                        AI 驅動的日語學習平台 · 毎日少しずつ、着実に
                      </p>
                    </div>
                  </footer>
                </main>
              </div>
            </div>
          ) : (
            <LandingPage onStart={openDashboard} onLogin={() => setAuthOpen(true)} />
          )}

          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
          <SpeakingPracticeModal
            open={speakingOpen}
            onClose={() => setSpeakingOpen(false)}
            scenarioKey={speakingScenario}
          />
          <ErrorNotebookModal open={notebookOpen} onClose={() => setNotebookOpen(false)} />
        </FuriganaProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
