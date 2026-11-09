import { createContext, useContext, useState, type ReactNode } from 'react';

interface LocalUser {
  email: string;
  id: string;
}

interface AuthContextValue {
  session: { user: LocalUser } | null;
  user: LocalUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'ai-nihongo-auth';
const ACCOUNTS_KEY = 'ai-nihongo-accounts';

interface StoredAccount {
  email: string;
  password: string;
  id: string;
}

function getAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

function getCurrentUser(): LocalUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user: LocalUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(() => getCurrentUser());
  const [loading] = useState(false);

  const signUp = async (email: string, password: string) => {
    const accounts = getAccounts();
    if (accounts.some((a) => a.email === email)) {
      return { error: '此電子郵件已註冊' };
    }
    const newAccount: StoredAccount = {
      email,
      password,
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    };
    accounts.push(newAccount);
    saveAccounts(accounts);
    const newUser: LocalUser = { email: newAccount.email, id: newAccount.id };
    setCurrentUser(newUser);
    setUser(newUser);
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email === email);
    if (!account) {
      return { error: '找不到此帳號，請先註冊' };
    }
    if (account.password !== password) {
      return { error: '密碼不正確' };
    }
    const newUser: LocalUser = { email: account.email, id: account.id };
    setCurrentUser(newUser);
    setUser(newUser);
    return { error: null };
  };

  const signOut = async () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session: user ? { user } : null,
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
