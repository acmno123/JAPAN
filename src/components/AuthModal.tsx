import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const result = mode === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Both signUp and signIn succeed with an active session.
      onClose();
      setEmail('');
      setPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-sumi-900/40 backdrop-blur-md dark:bg-sumi-900/70" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md animate-scale-in overflow-hidden rounded-2xl border border-washi-200/80 bg-washi-50 shadow-soft-lg dark:border-sumi-700 dark:bg-sumi-800">
        {/* Decorative header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-matcha-400 to-matcha-600 px-6 py-8 text-white">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <button
            onClick={onClose}
            aria-label="關閉"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-all hover:scale-105 hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="font-serif text-lg font-bold">AI-Nihongo</span>
            </div>
            <p className="mt-2 text-sm text-white/80">
              {mode === 'login' ? 'おかえりなさい、また会いましょう' : '新しい旅を始めましょう'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Mode tabs */}
          <div className="mb-5 flex rounded-xl border border-washi-200/80 bg-white/60 p-1 dark:border-sumi-700/60 dark:bg-sumi-700/40">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'login' ? 'bg-gradient-to-br from-matcha-400 to-matcha-500 text-white shadow-soft' : 'text-sumi-400 hover:text-sumi-600 dark:text-sumi-300'}`}
            >
              登入
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === 'signup' ? 'bg-gradient-to-br from-matcha-400 to-matcha-500 text-white shadow-soft' : 'text-sumi-400 hover:text-sumi-600 dark:text-sumi-300'}`}
            >
              註冊
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-sumi-500 dark:text-sumi-300">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sumi-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-washi-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-sumi-700 placeholder:text-sumi-300 transition-all focus:border-matcha-300 focus:outline-none focus:ring-2 focus:ring-matcha-200/40 dark:border-sumi-700/80 dark:bg-sumi-700/40 dark:text-washi-100 dark:placeholder:text-sumi-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-sumi-500 dark:text-sumi-300">パスワード</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sumi-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-washi-200/80 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-sumi-700 placeholder:text-sumi-300 transition-all focus:border-matcha-300 focus:outline-none focus:ring-2 focus:ring-matcha-200/40 dark:border-sumi-700/80 dark:bg-sumi-700/40 dark:text-washi-100 dark:placeholder:text-sumi-500"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200/60 bg-red-50/80 px-3.5 py-2.5 text-xs text-red-600 dark:border-red-700/40 dark:bg-red-700/20 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="animate-scale-in rounded-xl border border-matcha-200/60 bg-matcha-50/80 px-3.5 py-2.5 text-xs text-matcha-600 dark:border-matcha-700/40 dark:bg-matcha-700/20 dark:text-matcha-300">
                註冊成功！請登入您的帳號。
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-matcha-500 to-matcha-600 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-soft-lg disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> 処理中…</>
              ) : (
                <>
                  {mode === 'login' ? '登入' : '註冊'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-[0.7rem] text-sumi-400">
            {mode === 'login' ? '還沒有帳號？' : '已經有帳號？'}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="ml-1 font-semibold text-matcha-600 hover:underline dark:text-matcha-400"
            >
              {mode === 'login' ? '立即註冊' : '前往登入'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
