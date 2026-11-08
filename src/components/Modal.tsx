import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, icon, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in-up bg-sumi-900/40 backdrop-blur-sm dark:bg-sumi-900/70"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative z-10 flex max-h-[85vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl border border-washi-200/80 bg-washi-50 shadow-soft-lg dark:border-sumi-700 dark:bg-sumi-800`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-washi-200/80 px-5 py-4 dark:border-sumi-700/60">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-matcha-400 to-matcha-600 text-white shadow-soft">
                {icon}
              </span>
            )}
            <div>
              <h2 className="font-serif text-lg font-bold text-sumi-800 dark:text-washi-100">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-sumi-400">{subtitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sumi-400 transition-all hover:scale-105 hover:bg-washi-100 hover:text-sumi-700 dark:hover:bg-sumi-700 dark:hover:text-washi-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">{children}</div>
      </div>
    </div>
  );
}
