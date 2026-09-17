// Добавьте сюда Mail и Send 
import { Sun, Heart, Mail, Send } from 'lucide-react';


interface FooterProps {
  onOpenAgreement: () => void;
}

export default function Footer({ onOpenAgreement }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center">
              <Sun className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-white">ЛУЧИК</span>
          </div>


          {/* Description */}
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Сервис подбора психолога. Найдите своего специалиста —
            бережно, прозрачно, конфиденциально.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-400 border-y border-slate-800/60 py-3 w-full max-w-md">
            <span className="text-slate-500 font-medium">По вопросам работы сервиса:</span>
            
          <a 
              href="mailto:support@luchik.ru" 
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
              <Mail className="w-3.5 h-3.5" />
              support@luchik.ru
          </a>
          </div>

          {/* Legal Links */}
          <div className="flex justify-center text-xs text-slate-400 font-medium my-1">
            <button 
              onClick={onOpenAgreement} 
              className="hover:text-amber-400 transition-colors focus:outline-none underline"
            >
              Пользовательское соглашение и политика обработки данных
            </button>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            © 2026 ЛУЧИК · Сделано с <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
