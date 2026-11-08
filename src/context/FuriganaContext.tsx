import { createContext, useContext, useState, type ReactNode } from 'react';

interface FuriganaContextValue {
  show: boolean;
  toggle: () => void;
}

const FuriganaContext = createContext<FuriganaContextValue | undefined>(undefined);

export function FuriganaProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(true);
  return (
    <FuriganaContext.Provider value={{ show, toggle: () => setShow((p) => !p) }}>
      {children}
    </FuriganaContext.Provider>
  );
}

export function useFurigana() {
  const ctx = useContext(FuriganaContext);
  if (!ctx) throw new Error('useFurigana must be used within FuriganaProvider');
  return ctx;
}
