import { useState } from 'react';
import { User, Mail, Loader2, ArrowRight, Send, Info } from 'lucide-react';
import type { Psychologist, BookingData } from '@/types';
import { supabase } from '@/lib/supabase'; 

interface PaymentPageProps {
  psychologist: Psychologist;
  onPay: (data: BookingData) => void;
  onBack: () => void;
  onOpenAgreement?: () => void; // 👈 Добавили проп для открытия соглашения прямо из формы
}

export default function PaymentPage({ psychologist, onPay, onBack, onOpenAgreement }: PaymentPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [agreed, setAgreed] = useState(false); // 🚨 Стейт для отслеживания галочки согласия
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTelegramChange = (val: string) => {
    const cleanVal = val.replace(/@/g, '');
    setTelegram(cleanVal);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Дополнительная подстраховка: если галочка не стоит, не отправляем форму
    if (!agreed) return;

    setError(null);
    setSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from('appointments')
        .insert([
          {
            psychologist_id: psychologist.id,
            client_name: name,
            client_email: email,
            client_telegram: telegram || null,
          },
        ]);

      if (dbError) throw dbError;

      onPay({ psychologist, clientName: name, clientEmail: email, telegram });

    } catch (err: any) {
      console.error('Ошибка при сохранении в Supabase:', err);
      setError(err.message || 'Произошла ошибка при сохранении заявки в базу данных');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button 
          onClick={onBack}
          disabled={submitting}
          className="text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors flex items-center gap-1 disabled:opacity-50"
        >
          ← Назад
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-4">Запись на сессию</h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex gap-3 items-start shadow-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">
            Психолог свяжется с вами по указанному <strong className="text-slate-900">Telegram</strong> или <strong className="text-slate-900">почте</strong> для назначения удобного времени встречи и уточнения деталей оплаты.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
          {psychologist.photo_url && (
            <img src={psychologist.photo_url} alt={psychologist.name} className="w-14 h-14 rounded-xl object-cover" />
          )}
          <div className="flex-1">
            <h3 className="font-bold text-slate-800">{psychologist.name}</h3>
            <p className="text-sm text-amber-600">{psychologist.title}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-800">{Math.min(psychologist.price_per_session, 1500)} ₽</p>
            <p className="text-xs text-slate-400">за сессию</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">{error}</div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Контактные данные</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Ваше имя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required disabled={submitting} value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm disabled:bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required disabled={submitting} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm disabled:bg-slate-50" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Telegram</label>
                <span className="text-xs text-slate-400">Без символа @</span>
              </div>
              <div className="relative">
                <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required disabled={submitting} value={telegram} onChange={(e) => handleTelegramChange(e.target.value)} placeholder="username" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none text-sm disabled:bg-slate-50" />
              </div>
            </div>

            {/* 🚨 ТЕХНИЧЕСКИЙ БЛОК ЧЕКБОКСА СОГЛАСИЯ */}
            <div className="pt-2 border-t border-slate-100 flex items-start gap-3">
              <input
                id="legal-agreement"
                type="checkbox"
                disabled={submitting}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="legal-agreement" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
                Я подтверждаю, что мне исполнилось 18 лет, и я полностью принимаю{' '}
                <button
                  type="button"
                  onClick={onOpenAgreement}
                  className="text-amber-600 font-medium hover:underline inline focus:outline-none"
                >
                  Пользовательское соглашение и условия обработки персональных данных
                </button>{' '}
                сервиса «Лучик».
              </label>
            </div>
          </div>

          {/* ИСПРАВЛЕНО: Кнопка заблокирована (disabled), если стейт agreed равен false */}
          <button
            type="submit"
            disabled={submitting || !agreed}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm shadow-amber-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-amber-500 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Отправка заявки...
              </>
            ) : (
              <>
                Подтвердить запись
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
