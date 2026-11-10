import { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { FuriganaProvider } from '@/context/FuriganaContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { SpeakingPracticeCard, type ScenarioKey } from '@/components/SpeakingPracticeCard';
import { SentenceBreakdownCard } from '@/components/SentenceBreakdownCard';
import { VocabProgressCard } from '@/components/VocabProgressCard';
import { JlptReview } from '@/components/JlptReview';
import { JlptInfinitePractice } from '@/components/JlptInfinitePractice';
import { CountryExplorer } from '@/components/CountryExplorer';
import { SpeakingPracticeModal } from '@/components/SpeakingPracticeModal';
import { ErrorNotebookModal } from '@/components/ErrorNotebookModal';
import { AuthModal } from '@/components/AuthModal';
import { LandingPage } from '@/components/LandingPage';

const DASHBOARD_STORAGE_KEY = 'ai-nihongo-dashboard-visited';

const tasks = [
  { label: '待複習單字', detail: '根據你上次的學習記錄', value: '12 個', status: '建議現在完成', action: 'word-review' },
  { label: '句型練習', detail: 'まだ「〜わけではない」', value: '8 題', status: '尚未完成', action: 'sentence' },
  { label: '上次學習進度', detail: 'N4 · 餐廳點餐情境', value: '進度 64%', status: '從上次繼續', action: 'continue' },
] as const;

function App() {
  const [speakingOpen, setSpeakingOpen] = useState(false);
  const [speakingScenario, setSpeakingScenario] = useState<ScenarioKey | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(() => {
    try { return window.localStorage.getItem(DASHBOARD_STORAGE_KEY) === 'true'; } catch { return false; }
  });

  const openScenario = (key: ScenarioKey) => { setSpeakingScenario(key); setSpeakingOpen(true); };
  const openDashboard = () => {
    setShowDashboard(true);
    try { window.localStorage.setItem(DASHBOARD_STORAGE_KEY, 'true'); } catch { /* storage unavailable */ }
  };
  const startToday = () => openScenario('izakaya');

  return (
    <ThemeProvider><AuthProvider><FuriganaProvider>
      {showDashboard ? (
        <div className="app-shell min-h-screen bg-transparent text-[#172033] dark:bg-transparent dark:text-[#f5f7fb]">
          <div className="page-orbit page-orbit-one" aria-hidden="true" />
          <div className="page-orbit page-orbit-two" aria-hidden="true" />
          <Navbar streak={42} onAuthClick={() => setAuthOpen(true)} />
          <main className="today-page mx-auto max-w-[1240px] px-5 pb-24 pt-10 sm:px-8 lg:pt-16">
            <header className="today-header border-b border-[#dfe3ea] pb-10 dark:border-[#2b3342]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold tracking-wide text-[#5367d8] dark:text-[#9ca9ff]">星期二 · 11 月 10 日</p>
                  <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.045em] text-[#111827] dark:text-white sm:text-6xl">今天要完成什麼？</h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[#657084] dark:text-[#aeb7c7]">完成一個小任務，就能讓今天的日語更靠近真正使用。</p>
                </div>
                <div className="hidden border-l border-[#dfe3ea] pl-8 text-right dark:border-[#2b3342] md:block">
                  <p className="text-sm text-[#657084] dark:text-[#aeb7c7]">今日預計</p>
                  <p className="mt-1 text-3xl font-bold text-[#111827] dark:text-white">15 分鐘</p>
                </div>
              </div>
              <button onClick={startToday} className="primary-action mt-8 inline-flex items-center gap-3 bg-[#5367d8] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(83,103,216,0.24)] transition hover:-translate-y-0.5 hover:bg-[#4458c7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5367d8]">
                開始今日練習 <span aria-hidden>→</span>
              </button>
            </header>
            <section aria-labelledby="tasks-title" className="pt-10">
              <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.16em] text-[#5367d8]">TODAY</p><h2 id="tasks-title" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#172033] dark:text-white">今日學習任務</h2></div><span className="text-sm text-[#657084] dark:text-[#aeb7c7]">0 / 3 已完成</span></div>
              <div className="mt-5 divide-y divide-[#e2e6ec] border-y border-[#e2e6ec] dark:divide-[#2b3342] dark:border-[#2b3342]">
                {tasks.map((task, index) => <button key={task.action} onClick={() => task.action === 'continue' ? startToday() : setNotebookOpen(true)} className="task-row group grid w-full gap-4 py-5 text-left transition hover:bg-white dark:hover:bg-[#171d29] sm:grid-cols-[40px_1fr_auto] sm:items-center">
                  <span className="flex h-8 w-8 items-center justify-center border border-[#cfd5df] text-sm font-bold text-[#657084] dark:border-[#424b5d] dark:text-[#aeb7c7]">{index + 1}</span>
                  <span><span className="block text-base font-bold text-[#172033] dark:text-white">{task.label}</span><span className="mt-1 block text-sm text-[#657084] dark:text-[#aeb7c7]">{task.detail}</span></span>
                  <span className="flex items-center justify-between gap-5 sm:justify-end"><span><span className="block text-right text-lg font-bold text-[#172033] dark:text-white">{task.value}</span><span className="mt-1 block text-right text-xs text-[#657084] dark:text-[#aeb7c7]">{task.status}</span></span><span className="text-xl text-[#5367d8] transition group-hover:translate-x-1" aria-hidden>→</span></span>
                </button>)}
              </div>
            </section>
            <section className="mt-14 grid gap-10 border-t border-[#dfe3ea] pt-10 dark:border-[#2b3342] lg:grid-cols-[1fr_0.72fr]">
              <div><p className="text-xs font-bold tracking-[0.16em] text-[#5367d8]">RECOMMENDED FOR YOU</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#172033] dark:text-white">今日推薦情境</h2><div className="mt-5 border border-[#dfe3ea] bg-white/85 p-6 shadow-[0_18px_45px_rgba(55,65,100,0.07)] backdrop-blur-sm dark:border-[#2b3342] dark:bg-[#171d29]/85 sm:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-sm font-bold text-[#5367d8] dark:text-[#9ca9ff]">生活會話 · N4</p><h3 className="mt-3 text-2xl font-bold text-[#172033] dark:text-white">在居酒屋點餐</h3><p className="mt-3 max-w-md text-sm leading-6 text-[#657084] dark:text-[#aeb7c7]">練習如何入座、詢問推薦菜色，並自然地向店員點餐。</p></div><span className="text-3xl" aria-hidden>🍶</span></div><div className="mt-7 flex items-center justify-between border-t border-[#e7e9ee] pt-5 text-sm dark:border-[#2b3342]"><span className="text-[#657084] dark:text-[#aeb7c7]">約 8 分鐘 · 口說</span><button onClick={startToday} className="font-bold text-[#5367d8] hover:text-[#4458c7]">開始情境 →</button></div></div></div>
              <aside><p className="text-xs font-bold tracking-[0.16em] text-[#5367d8]">CONTINUE</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#172033] dark:text-white">上次學到這裡</h2><div className="mt-5 border-l-2 border-[#5367d8] pl-5"><p className="text-sm text-[#657084] dark:text-[#aeb7c7]">餐廳點餐 · 第 4 課</p><p className="mt-2 text-lg font-bold text-[#172033] dark:text-white">表達需求與確認</p><div className="mt-5 h-1.5 bg-[#e4e7ed] dark:bg-[#2b3342]"><div className="h-full w-[64%] bg-[#5367d8]" /></div><p className="mt-2 text-right text-xs font-semibold text-[#657084] dark:text-[#aeb7c7]">64%</p></div></aside>
            </section>
            <section className="mt-16 border-t border-[#dfe3ea] pt-10 dark:border-[#2b3342]"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.16em] text-[#5367d8]">EXPLORE</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#172033] dark:text-white">需要其他練習？</h2></div><button onClick={() => setNotebookOpen(true)} className="text-sm font-bold text-[#5367d8]">查看錯題本 →</button></div><div className="mt-6 grid gap-5 md:grid-cols-3"><div className="minimal-tool"><SentenceBreakdownCard /></div><div className="minimal-tool"><SpeakingPracticeCard onSelect={openScenario} /></div><div className="minimal-tool"><VocabProgressCard onOpenNotebook={() => setNotebookOpen(true)} /></div></div></section>
            <div className="mt-16 space-y-16"><JlptInfinitePractice /><JlptReview /><CountryExplorer /></div>
          </main>
        </div>
      ) : <LandingPage onStart={openDashboard} onLogin={() => setAuthOpen(true)} />}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} /><SpeakingPracticeModal open={speakingOpen} onClose={() => setSpeakingOpen(false)} scenarioKey={speakingScenario} /><ErrorNotebookModal open={notebookOpen} onClose={() => setNotebookOpen(false)} />
    </FuriganaProvider></AuthProvider></ThemeProvider>
  );
}

export default App;
