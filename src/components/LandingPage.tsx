import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, Compass, Headphones, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export function LandingPage({ onStart, onLogin }: LandingPageProps) {
  const { signUp } = useAuth();
  const [signupOpen, setSignupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signUp(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  const openSignup = () => {
    setSignupOpen(true);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#252821]">
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" aria-label="AI-Nihongo 首頁">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#314c3b] text-white shadow-lg shadow-[#314c3b]/15">
            <span className="font-serif text-xl">あ</span>
          </span>
          <span>
            <span className="block font-serif text-lg font-semibold tracking-tight">AI-Nihongo</span>
            <span className="block text-[9px] font-medium tracking-[0.3em] text-[#7b806f]">JAPANESE, YOUR WAY</span>
          </span>
        </a>
        <nav className="hidden items-center gap-9 text-sm text-[#62675d] md:flex" aria-label="主要導覽">
          <a className="transition hover:text-[#314c3b]" href="#method">學習方式</a>
          <a className="transition hover:text-[#314c3b]" href="#features">平台特色</a>
          <button onClick={onLogin} className="transition hover:text-[#314c3b]">登入</button>
          <button onClick={openSignup} className="rounded-full bg-[#314c3b] px-5 py-2.5 font-medium text-white transition hover:bg-[#243c2d]">免費註冊</button>
        </nav>
        <button onClick={openSignup} className="rounded-full bg-[#314c3b] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#243c2d] md:hidden">開始註冊</button>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 md:min-h-[620px] md:grid-cols-[0.92fr_1.08fr] md:gap-8 md:pb-24 md:pt-12 lg:px-12">
          <div className="relative z-10 max-w-xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce2d7] bg-white/70 px-3.5 py-2 text-xs font-medium tracking-wide text-[#526c54]">
              <Sparkles className="h-3.5 w-3.5" />
              讓日語，成為你的日常風景
            </div>
            <p className="mb-3 font-serif text-sm tracking-[0.32em] text-[#9b7054]">学ぶほど、世界が広がる。</p>
            <h1 className="font-serif text-[3.2rem] font-medium leading-[1.13] tracking-[-0.055em] text-[#28352d] sm:text-6xl lg:text-[4.35rem]">
              不只學日語，<br />
              <span className="text-[#66816a]">更靠近</span>你喜歡的日本。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#73776d] sm:text-lg">
              從一句對話、一個新單字開始。用 AI 打造適合你的學習節奏，讓每一次練習，都成為走進日本生活的一小步。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button onClick={openSignup} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#314c3b] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-[#314c3b]/15 transition hover:-translate-y-0.5 hover:bg-[#243c2d]">
                免費開始學習 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onStart} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9d9ce] bg-white/60 px-7 py-4 text-sm font-medium text-[#51594f] transition hover:border-[#9cac98] hover:bg-white">
                探索學習平台 <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-[#818579]">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f5ef] bg-[#d6b49b] text-[10px]">A</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f5ef] bg-[#a7b49b] text-[10px]">Y</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f7f5ef] bg-[#d7c88f] text-[10px]">M</span>
              </span>
              <span><strong className="font-semibold text-[#4c554a]">每天 15 分鐘</strong>，累積成看得見的進步</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] md:ml-auto">
            <div className="absolute -right-7 -top-7 h-40 w-40 rounded-full bg-[#e6e8d8] blur-3xl" />
            <div className="absolute -bottom-9 -left-10 h-48 w-48 rounded-full bg-[#e9d8c6] blur-3xl" />
            <div className="relative h-[390px] overflow-hidden rounded-[2rem] bg-[#d8d6ca] shadow-2xl shadow-[#35473a]/15 sm:h-[480px]">
              <img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=85" alt="日本京都傳統街道與遠方的山景" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17251d]/60 via-transparent to-[#17251d]/10" />
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-2 text-xs text-white backdrop-blur-md sm:left-8 sm:top-8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d7e8ba]" /> AI 個人化學習
              </div>
              <div className="absolute bottom-7 left-7 right-7 text-white sm:bottom-9 sm:left-9">
                <p className="text-xs tracking-[0.26em] text-white/75">YOUR NEXT CHAPTER</p>
                <p className="mt-2 font-serif text-3xl sm:text-4xl">旅のはじまり。</p>
                <p className="mt-2 text-sm text-white/80">讓每一次學習，都更接近真實對話。</p>
              </div>
            </div>
            <div className="absolute -bottom-6 right-4 w-[220px] rounded-2xl border border-white/70 bg-[#fffefa]/95 p-4 shadow-xl shadow-[#2c3d30]/10 sm:-right-8 sm:bottom-10">
              <div className="flex items-center justify-between text-[11px] text-[#82877a]"><span>今日學習進度</span><span className="text-[#66816a]">+12%</span></div>
              <div className="mt-3 flex items-end justify-between"><span className="font-serif text-2xl text-[#314c3b]">いい調子！</span><span className="text-xs text-[#82877a]">連續 7 天</span></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8e8df]"><div className="h-full w-3/4 rounded-full bg-[#789174]" /></div>
            </div>
            <div className="absolute -left-5 top-1/2 hidden -translate-y-1/2 rounded-2xl border border-white/70 bg-[#fffefa]/95 p-4 shadow-xl shadow-[#2c3d30]/10 sm:block">
              <p className="text-[10px] tracking-[0.18em] text-[#999b8f]">WORD OF THE DAY</p>
              <p className="mt-1 font-serif text-2xl text-[#314c3b]">木漏れ日</p>
              <p className="text-xs text-[#82877a]">こもれび · 林間灑落的陽光</p>
            </div>
          </div>
        </section>

        <section id="method" className="border-y border-[#e7e5dc] bg-[#efeee7]">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-0 lg:px-12">
            <div className="flex items-center gap-4 md:border-r md:border-[#dcdcd1] md:px-8 md:first:pl-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#67806a]"><BookOpen className="h-5 w-5" /></span>
              <div><p className="font-serif text-lg text-[#364438]">學得有脈絡</p><p className="mt-1 text-xs text-[#818579]">文法、單字與語感一起進步</p></div>
            </div>
            <div className="flex items-center gap-4 md:border-r md:border-[#dcdcd1] md:px-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#67806a]"><Headphones className="h-5 w-5" /></span>
              <div><p className="font-serif text-lg text-[#364438]">開口更自然</p><p className="mt-1 text-xs text-[#818579]">情境式口說練習，不怕說錯</p></div>
            </div>
            <div className="flex items-center gap-4 md:pl-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#67806a]"><Compass className="h-5 w-5" /></span>
              <div><p className="font-serif text-lg text-[#364438]">探索日本文化</p><p className="mt-1 text-xs text-[#818579]">在語言中發現更多日本日常</p></div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="text-xs font-semibold tracking-[0.26em] text-[#8b9b7c]">A MORE HUMAN WAY TO LEARN</p><h2 className="mt-3 font-serif text-3xl text-[#29382e] sm:text-4xl">從你想去的地方，開始學習。</h2></div>
            <button onClick={onStart} className="group inline-flex items-center gap-2 self-start text-sm font-medium text-[#526c54] md:self-auto">看看完整學習平台 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: '01', title: '拆解每一句日語', text: '逐句理解文法與語意，讓看懂日文不再只靠猜。', icon: <BookOpen className="h-5 w-5" /> },
              { number: '02', title: '在情境中開口', text: '用日常情境練習對話，讓學到的日語真正派上用場。', icon: <Headphones className="h-5 w-5" /> },
              { number: '03', title: '打造自己的節奏', text: '每日推薦、單字追蹤與 JLPT 練習，照自己的步調前進。', icon: <Sparkles className="h-5 w-5" /> },
            ].map((feature) => (
              <article key={feature.number} className="group rounded-2xl border border-[#e8e6dc] bg-[#fbfaf6] p-6 transition hover:-translate-y-1 hover:border-[#cbd4c5] hover:shadow-lg hover:shadow-[#405642]/5 sm:p-7">
                <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf0e7] text-[#66816a]">{feature.icon}</span><span className="font-serif text-sm text-[#a3a597]">{feature.number}</span></div>
                <h3 className="mt-7 font-serif text-xl text-[#364438]">{feature.title}</h3><p className="mt-2 text-sm leading-7 text-[#7a7e73]">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-5 mb-12 overflow-hidden rounded-[2rem] bg-[#314c3b] sm:mx-8 lg:mx-auto lg:max-w-7xl">
          <div className="relative flex flex-col items-start justify-between gap-8 px-7 py-12 sm:px-12 md:flex-row md:items-center md:px-16 md:py-14">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border border-white/10" /><div className="absolute -right-4 -top-16 h-56 w-56 rounded-full border border-white/10" />
            <div className="relative"><p className="text-xs tracking-[0.24em] text-[#c5d2b9]">YOUR JOURNEY STARTS HERE</p><h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">日本語で、世界を広げよう。</h2><p className="mt-3 text-sm text-white/70">今天就開始，為自己打開一扇新的窗。</p></div>
            <button onClick={openSignup} className="group relative inline-flex shrink-0 items-center gap-3 rounded-full bg-[#f6f4eb] px-7 py-4 text-sm font-semibold text-[#314c3b] transition hover:bg-white">免費建立帳號 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 pb-8 text-xs text-[#929588] sm:flex-row sm:px-8 lg:px-12">
        <span>© 2026 AI-Nihongo · 每日少しずつ、着実に。</span>
        <button onClick={onLogin} className="transition hover:text-[#526c54]">已經有帳號？登入</button>
      </footer>

      {signupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
          <button className="absolute inset-0 bg-[#17251d]/55 backdrop-blur-sm" aria-label="關閉註冊視窗" onClick={() => setSignupOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="signup-title" className="relative w-full max-w-md rounded-3xl border border-white/60 bg-[#fbfaf6] p-7 shadow-2xl sm:p-9">
            <button onClick={() => setSignupOpen(false)} aria-label="關閉" className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-[#85897e] transition hover:bg-[#eeeee6]">×</button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8eee5] text-[#526c54]"><Sparkles className="h-5 w-5" /></div>
            <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#8b9b7c]">BEGIN YOUR JOURNEY</p>
            <h2 id="signup-title" className="mt-2 font-serif text-3xl text-[#29382e]">建立你的學習旅程</h2>
            <p className="mt-2 text-sm leading-6 text-[#7a7e73]">註冊帳號，從今天開始累積你的日語進步。</p>
            {success ? (
              <div className="mt-7 rounded-2xl border border-[#d8e5d4] bg-[#eff5eb] p-5 text-sm leading-6 text-[#49664b]">
                <Check className="mb-2 h-5 w-5" />註冊成功！請查看電子郵件完成帳號驗證，接著就可以開始學習了。
              </div>
            ) : (
              <form onSubmit={handleSignup} className="mt-7 space-y-4">
                <label className="block text-xs font-medium text-[#5f675c]">電子郵件
                  <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-[#dedfd5] bg-white px-4 py-3 text-sm text-[#29382e] outline-none transition placeholder:text-[#b2b4a9] focus:border-[#82977f] focus:ring-4 focus:ring-[#82977f]/10" />
                </label>
                <label className="block text-xs font-medium text-[#5f675c]">密碼
                  <input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 6 個字元" className="mt-2 w-full rounded-xl border border-[#dedfd5] bg-white px-4 py-3 text-sm text-[#29382e] outline-none transition placeholder:text-[#b2b4a9] focus:border-[#82977f] focus:ring-4 focus:ring-[#82977f]/10" />
                </label>
                {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-xs leading-5 text-red-700">{error}</p>}
                <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#314c3b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#243c2d] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? '建立帳號中…' : <>免費註冊 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                </button>
              </form>
            )}
            <p className="mt-5 text-center text-xs text-[#85897e]">已經有帳號？ <button onClick={() => { setSignupOpen(false); onLogin(); }} className="font-semibold text-[#526c54] hover:underline">前往登入</button></p>
          </div>
        </div>
      )}
    </div>
  );
}
