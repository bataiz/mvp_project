import { Sun, ArrowLeft } from 'lucide-react';
import type { View } from '@/types';

interface HeaderProps {
  view: View;
  onNavigate: (view: View) => void;
}

export default function Header({ view, onNavigate }: HeaderProps) {
  const showBack = view === 'detail' || view === 'payment' || view === 'confirmation';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-lg border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {showBack ? (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Назад</span>
            </button>
          ) : (
            <div className="w-20" />
          )}

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-sm">
              <Sun className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[12px] font-bold text-slate-800 tracking-tight">
              ЛУЧИК
            </span>
          </button>

          <div className="w-20" />
        </div>
      </div>
    </header>
  );
}
