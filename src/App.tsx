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

function App() {
  const streak = 42;
  const wordsToday = 28;
  const minutesToday = 15;

  const [speakingOpen, setSpeakingOpen] = useState(false);
  const [speakingScenario, setSpeakingScenario] = useState<ScenarioKey | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const openScenario = (key: ScenarioKey) => {
    setSpeakingScenario(key);
    setSpeakingOpen(true);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <FuriganaProvider>
          {showDashboard ? (
            <div className="relative min-h-screen overflow-hidden bg-washi-50 transition-colors duration-500 dark:bg-sumi-900">
              <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
                <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-matcha-100/50 blur-[120px] dark:bg-matcha-700/15" />
                <div className="absolute top-1/3 -left-40 h-[30rem] w-[30rem] rounded-full bg-wood-100/60 blur-[120px] dark:bg-wood-500/10" />
                <div className="absolute bottom-0 right-1/4 h-[24rem] w-[24rem] rounded-full bg-washi-200/50 blur-[100px] dark:bg-sumi-800/40" />
                <div
                  className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #5c5a53 1px, transparent 1px), linear-gradient(to bottom, #5c5a53 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />
              </div>

              <div className="relative z-10 mx-auto max-w-[1650px]">
                <Navbar streak={streak} onAuthClick={() => setAuthOpen(true)} />
                <main className="pb-20">
                  <div className="section-shell mt-5 sm:mt-7">
                    <div className="micro-badge">
                      <span className="h-2 w-2 rounded-full bg-matcha-500 shadow-[0_0_12px_rgba(79,132,73,0.7)]" />
                      今日學習任務 · 15 分鐘
                    </div>
                  </div>
                  <div id="home" />
                  <HeroAnalytics wordsToday={wordsToday} minutesToday={minutesToday} streak={streak} />
                  <section className="section-shell pt-14" id="features">
                    <div className="mb-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium tracking-[0.24em] text-matcha-500 dark:text-matcha-400">CORE FEATURES</p>
                        <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-sumi-800 dark:text-washi-100 sm:text-3xl">
                          あなたに合った学習スタイル
                        </h2>
                      </div>
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-washi-300 to-transparent sm:block dark:via-sumi-700" />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
            <LandingPage onStart={() => setShowDashboard(true)} onLogin={() => setAuthOpen(true)} />
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
