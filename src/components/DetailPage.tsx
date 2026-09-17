import {
  Globe, Calendar, ArrowRight, BadgeCheck, Stethoscope, Heart, Briefcase,
} from 'lucide-react';
import type { Psychologist } from '@/types';

interface DetailPageProps {
  psychologist: Psychologist;
  onSchedule: (p: Psychologist) => void;
}

export default function DetailPage({ psychologist, onSchedule }: DetailPageProps) {
  // Динамически определяем подпись для небольшого опыта работы
  const experienceText = psychologist.experience_years <= 1 ? 'до 1 года' : 'до 2 лет';

  // 🚨 ЛОГИКА ОГРАНИЧЕНИЯ ЦЕНЫ: выбирает меньшее из цены в БД и 1500
  const rawPrice = Number(psychologist.price_per_session) || 0;
  const displayedPrice = rawPrice > 1500 ? 1500 : rawPrice;

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <div className="relative h-36 bg-gradient-to-br from-amber-400 to-orange-500">
            <div className="absolute -bottom-10 left-6">
              {psychologist.photo_url ? (
                <img
                  src={psychologist.photo_url}
                  alt={psychologist.name}
                  className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex flex-shrink-0 items-center justify-center text-3xl font-bold text-amber-500 select-none">
                  {psychologist.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="pt-14 px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 break-words">{psychologist.name}</h1>
                <p className="text-amber-600 font-medium mt-0.5">{psychologist.title}</p>
              </div>
              
              {/* Красивый бейдж с небольшим опытом работы */}
              <div className="flex items-center gap-1.5 self-start sm:self-center px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Опыт: {experienceText}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-slate-50">
                <Heart className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-slate-400">Супервизия</span>
                <span className="text-sm font-bold text-slate-700">
                  {psychologist.supervision_hours.toLocaleString('ru-RU')} ч
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-slate-50">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-slate-400">Сессия</span>
                {/* 🚨 ИСПРАВЛЕНО: выводим новую переменную цены с лимитом */}
                <span className="text-sm font-bold text-slate-700 break-all">
                  {displayedPrice} ₽
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Short description */}
        {psychologist.bio && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">О психологе</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{psychologist.bio}</p>
          </div>
        )}

        {/* Practice stats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <Stethoscope className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-800">
            {psychologist.practice_hours.toLocaleString('ru-RU')}
          </p>
          <p className="text-sm text-slate-400 mt-1">часов практической работы с клиентами</p>
        </div>

        {/* Education with confirmed badge */}
        {psychologist.university && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h2 className="text-lg font-bold text-slate-800">Образование</h2>
              <span className="inline-flex flex-shrink-0 items-center gap-1 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                <BadgeCheck className="w-3.5 h-3.5" />
                Подтверждено
              </span>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <BadgeCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600 leading-relaxed">
                {psychologist.university}
              </p>
            </div>
          </div>
        )}

        {/* Specialties */}
        {psychologist.specialties && psychologist.specialties.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Специализации</h2>
            <div className="flex flex-wrap gap-2">
              {psychologist.specialties.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Approaches */}
        {psychologist.approaches && psychologist.approaches.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Методы работы</h2>
            <div className="flex flex-wrap gap-2">
              {psychologist.approaches.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Schedule button */}
        <button
          onClick={() => onSchedule(psychologist)}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Запланировать встречу за {displayedPrice} ₽
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
