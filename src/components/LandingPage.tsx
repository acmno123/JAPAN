import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, Compass, Headphones, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

type DesignStyle = 'zen' | 'studio' | 'campus';

const styles: { id: DesignStyle; label: string; caption: string }[] = [
  { id: 'zen', label: 'A・日系文青', caption: '留白、和紙與靜謐京都色調' },
  { id: 'studio', label: 'B・AI SaaS', caption: '俐落科技感與智慧學習工具' },
  { id: 'campus', label: 'C・學習平台', caption: '行銷首頁與完整學習 dashboard' },
];

const styleTokens: Record<DesignStyle, { background: string; ink: string; accent: string; card: string; heroImage: string; label: string }> = {
  zen: { background: 'bg-[#f7f5ef]', ink: 'text-[#28352d]', accent: 'bg-[#314c3b]', card: 'bg-[#fbfaf6]', heroImage: 'rounded-[3rem]', label: '静かな学び · QUIET LEARNING' },
  studio: { background: 'bg-[#f1f3f6]', ink: 'text-[#172334]', accent: 'bg-[#3658c8]', card: 'bg-white', heroImage: 'rounded-[1.5rem]', label: 'AI LEARNING STUDIO · PERSONALIZED FOR YOU' },
  campus: { background: 'bg-[#f7f5ef]', ink: 'text-[#28352d]', accent: 'bg-[#314c3b]', card: 'bg-[#fbfaf6]', heroImage: 'rounded-[2rem]', label: 'YOUR JAPANESE LEARNING JOURNEY' },
};

export function LandingPage({ onStart, onLogin }: LandingPageProps) {
  const { signUp } = useAuth();
  const [design, setDesign] = useState<DesignStyle>('campus');
  const [signupOpen, setSignupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = styleTokens[design];

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result.error) setError(result.error);
      else {
        setSuccess(true);
        setTimeout(() => { onStart(); }, 1500);
      }
    } catch {
      setError('目前無法建立帳號，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const openSignup = () => {
    setSignupOpen(true);
    setError(null);
    setSuccess(false);
  };

  const featureItems = [
    { number: '01', title: '拆解每一句日語', text: '逐句理解文法與語意，建立真正的語感。', icon: BookOpen },
    { number: '02', title: '在情境中開口', text: '從日常對話開始，自然練習聽力與表達。', icon: Headphones },
    { number: '03', title: '照自己的節奏前進', text: '每日推薦、單字追蹤與 JLPT 練習整合一處。', icon: TrendingUp },
  ];

  return (
    <div className={`min-h-screen overflow-hidden ${theme.background} ${theme.ink} transition-colors duration-500`}>
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="AI-Nihongo 首頁">
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${theme.accent} font-serif text-xl text-white shadow-lg`}>あ</span>
            <span><span className="block font-serif text-lg font-semibold tracking-tight">AI-Nihongo</span><span className="block text-[9px] font-medium tracking-[0.3em] text-slate-500">JAPANESE, YOUR WAY</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-slate-600 md:flex" aria-label="主要導覽">
            <a className="transition hover:text-slate-950" href="#method">學習方式</a>
            <a className="transition hover:text-slate-950" href="#features">平台特色</a>
            <button onClick={onLogin} className="transition hover:text-slate-950">登入</button>
            <button onClick={openSignup} className={`rounded-full ${theme.accent} px-5 py-2.5 font-medium text-white transition hover:-translate-y-0.5`}>免費註冊</button>
          </nav>
          <button onClick={openSignup} className={`rounded-full ${theme.accent} px-4 py-2.5 text-sm font-medium text-white md:hidden`}>免費註冊</button>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 md:min-h-[650px] md:grid-cols-[0.95fr_1.05fr] md:gap-10 md:pb-24 lg:px-12">
          <div className="relative z-10 max-w-xl">
            <p className={`mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-xs font-medium tracking-wide text-slate-600 ${design === 'studio' ? 'shadow-lg shadow-blue-900/5' : ''}`}>
              <Sparkles className={`h-3.5 w-3.5 ${design === 'studio' ? 'text-blue-600' : 'text-[#66816a]'}`} />{theme.label}
            </p>
            <p className="mb-3 font-serif text-sm tracking-[0.32em] text-[#9b7054]">学ぶほど、世界が広がる。</p>
            <h1 className={`font-serif text-[3.1rem] font-medium leading-[1.1] tracking-[-0.06em] sm:text-6xl lg:text-[4.3rem] ${theme.ink}`}>
              不只學日語，<br /><span className={design === 'studio' ? 'text-blue-600' : 'text-[#66816a]'}>更靠近</span>你喜歡的日本。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              從一句對話、一個新單字開始。用適合你的學習節奏，讓每次練習都成為走進日本生活的一小步。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={openSignup} className={`group inline-flex items-center justify-center gap-3 rounded-full ${theme.accent} px-7 py-4 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-0.5`}>
                免費開始學習<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-7 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-500">
                探索學習平台<ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-slate-500"><span className="flex -space-x-2" aria-hidden><span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#d6b49b] text-white">あ</span><span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#a7b49b] text-white">日</span><span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#d7c88f] text-white">語</span></span><span><strong className="font-semibold text-slate-700">每天 15 分鐘</strong>，累積成看得見的進步</span></div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] md:ml-auto">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#dfe8d8] blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-44 w-44 rounded-full bg-[#eadbca] blur-3xl" />
            <div className={`relative h-[390px] overflow-hidden ${theme.heroImage} bg-slate-200 shadow-2xl sm:h-[500px]`}>
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85" alt="日本京都傳統街道" className="h-full w-full object-cover" />
              <div className={`absolute inset-0 ${design === 'studio' ? 'bg-gradient-to-tr from-[#142039]/80 via-[#142039]/10 to-blue-900/10' : 'bg-gradient-to-t from-[#17251d]/70 via-transparent to-[#17251d]/10'}`} />
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xs text-white backdrop-blur-md"><span className="h-1.5 w-1.5 rounded-full bg-[#d7e8ba]" />AI 個人化學習</div>
              <div className="absolute bottom-8 left-7 right-7 text-white sm:bottom-10 sm:left-9"><p className="text-[10px] tracking-[0.28em] text-white/75">YOUR NEXT CHAPTER</p><p className="mt-2 font-serif text-3xl sm:text-4xl">旅のはじまり。</p><p className="mt-2 text-sm text-white/85">讓每一次學習，都更接近真實對話。</p></div>
            </div>
            <div className="absolute -bottom-6 right-3 w-[220px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl sm:-right-7 sm:bottom-10"><div className="flex items-center justify-between text-[11px] text-slate-500"><span>今日學習進度</span><span className="text-emerald-700">+12%</span></div><div className="mt-3 flex items-end justify-between"><span className="font-serif text-2xl text-[#314c3b]">いい調子！</span><span className="text-xs text-slate-500">連續 7 天</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full w-3/4 rounded-full ${design === 'studio' ? 'bg-blue-600' : 'bg-[#789174]'}`} /></div></div>
            <div className="absolute -left-5 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl sm:block"><p className="text-[10px] tracking-[0.18em] text-slate-400">WORD OF THE DAY</p><p className="mt-1 font-serif text-2xl text-[#314c3b]">木漏れ日</p><p className="text-xs text-slate-500">こもれび · 林間灑落的陽光</p></div>
          </div>
        </section>

        <section className="border-y border-black/[0.06] bg-white/50" id="method">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-0 lg:px-12">
            {[{ title: '學得有脈絡', text: '文法、單字與語感一起進步', icon: BookOpen }, { title: '開口更自然', text: '情境式口說練習，不怕說錯', icon: Headphones }, { title: '探索日本文化', text: '在語言中發現更多日本日常', icon: Compass }].map(({ title, text, icon: Icon }) => <div key={title} className="flex items-center gap-4 md:border-r md:border-slate-200 md:px-8 md:first:pl-0 md:last:border-0"><span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${design === 'studio' ? 'bg-blue-50 text-blue-700' : 'bg-[#edf0e7] text-[#67806a]'}`}><Icon className="h-5 w-5" /></span><div><p className="font-serif text-lg text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{text}</p></div></div>)}
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className={`text-xs font-semibold tracking-[0.26em] ${design === 'studio' ? 'text-blue-600' : 'text-[#8b9b7c]'}`}>A MORE HUMAN WAY TO LEARN</p><h2 className="mt-3 max-w-3xl font-serif text-3xl text-slate-800 sm:text-4xl">從你想學的日語，開始更自然的旅程</h2></div><button onClick={onStart} className="group inline-flex items-center gap-2 self-start text-sm font-medium text-slate-600 md:self-auto">看看完整學習平台<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{featureItems.map(({ number, title, text, icon: Icon }) => <article key={number} className={`group rounded-[26px] border border-black/[0.07] ${theme.card} p-6 shadow-[0_16px_30px_rgba(30,40,35,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-xl`}><div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-full ${design === 'studio' ? 'bg-blue-50 text-blue-700' : 'bg-[#edf0e7] text-[#66816a]'}`}><Icon className="h-5 w-5" /></span><span className="text-xs font-semibold tracking-[0.2em] text-slate-400">{number}</span></div><h3 className="mt-7 font-serif text-xl text-slate-800">{title}</h3><p className="mt-2 text-sm leading-7 text-slate-500">{text}</p></article>)}</div>
        </section>

        <section className={`mx-5 mb-12 overflow-hidden rounded-[2rem] ${design === 'studio' ? 'bg-[#172b55]' : 'bg-[#314c3b]'} sm:mx-8 lg:mx-auto lg:max-w-7xl`}><div className="relative flex flex-col items-start justify-between gap-8 px-7 py-12 sm:px-12 md:flex-row md:items-center md:px-16 md:py-14"><div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border border-white/10" /><div className="relative"><p className="text-xs tracking-[0.24em] text-white/65">YOUR JOURNEY STARTS HERE</p><h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">日本語を、あなたの生活に合わせて。</h2><p className="mt-3 text-sm text-white/70">每天一點點，累積成真正帶得走的能力。</p></div><button onClick={openSignup} className="group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5">免費開始<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></div></section>

        <section aria-labelledby="design-options" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-12"><div className="rounded-[28px] border border-black/[0.07] bg-white/70 p-6 shadow-sm sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold tracking-[0.24em] text-slate-400">CHOOSE YOUR EXPERIENCE</p><h2 id="design-options" className="mt-2 font-serif text-2xl text-slate-800">三種風格，一個完整的學習旅程</h2><p className="mt-2 text-sm text-slate-500">切換風格預覽；進入平台後可體驗整合式學習 dashboard。</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">目前：{styles.find((item) => item.id === design)?.label}</span></div><div className="mt-6 grid gap-3 md:grid-cols-3">{styles.map((item) => <button key={item.id} onClick={() => setDesign(item.id)} aria-pressed={design === item.id} className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${design === item.id ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800/10' : 'border-slate-200 bg-white hover:border-slate-400'}`}><span className="flex items-center justify-between"><span className="font-semibold text-slate-800">{item.label}</span><span className={`h-3 w-3 rounded-full ${item.id === 'studio' ? 'bg-blue-600' : 'bg-[#66816a]'}`} /></span><span className="mt-2 block text-xs leading-5 text-slate-500">{item.caption}</span></button>)}</div></div></section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 pb-8 text-xs text-slate-400 sm:flex-row sm:px-8 lg:px-12"><span>© 2026 AI-Nihongo · 每日少しずつ、着実に。</span><button onClick={onLogin} className="transition hover:text-slate-700">已經有帳號？登入</button></footer>

      {signupOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation"><button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" aria-label="關閉註冊視窗" onClick={() => setSignupOpen(false)} /><div role="dialog" aria-modal="true" aria-labelledby="signup-title" className="relative w-full max-w-md rounded-3xl border border-white/60 bg-[#fbfaf6] p-7 shadow-2xl sm:p-9"><button onClick={() => setSignupOpen(false)} aria-label="關閉" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100">×</button><div className={`flex h-11 w-11 items-center justify-center rounded-full ${design === 'studio' ? 'bg-blue-50 text-blue-700' : 'bg-[#e8eee5] text-[#526c54]'}`}><Sparkles className="h-5 w-5" /></div><p className="mt-6 text-xs font-semibold tracking-[0.2em] text-slate-500">BEGIN YOUR JOURNEY</p><h2 id="signup-title" className="mt-2 font-serif text-3xl text-slate-800">建立你的學習旅程</h2><p className="mt-2 text-sm leading-6 text-slate-500">註冊帳號，從今天開始累積你的日語進步。</p>{success ? <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800"><Check className="mb-2 h-5 w-5" />註冊成功！正在為你進入學習平台…</div> : <form onSubmit={handleSignup} className="mt-7 space-y-4"><label className="block text-xs font-medium text-slate-600">電子郵件<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none" /></label><label className="block text-xs font-medium text-slate-600">密碼<input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 6 個字元" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">{error}</p>}<button type="submit" disabled={loading} className={`group flex w-full items-center justify-center gap-2 rounded-full ${theme.accent} px-6 py-3.5 text-sm font-semibold text-white transition disabled:opacity-70`}>{loading ? '建立帳號中…' : <>免費註冊<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}</button></form>}<p className="mt-5 text-center text-xs text-slate-500">已經有帳號？ <button onClick={() => { setSignupOpen(false); onLogin(); }} className="font-semibold text-slate-700 hover:underline">立即登入</button></p></div></div>}
    </div>
  );
}
