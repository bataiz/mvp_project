import { Clock, ArrowRight, GraduationCap, Briefcase } from 'lucide-react';
import type { Psychologist } from '@/types';

interface PsychologistCardProps {
  psychologist: Psychologist;           // Строгий тип из вашей таблицы Supabase
  onSelect: (p: Psychologist) => void;  // ИСПРАВЛЕНО: Заменили onClick на onSelect!
}

const KNOWN_UNIVERSITIES = [
  { key: 'ВШЭ', display: 'НИУ ВШЭ' },
  { key: 'МГУ', display: 'МГУ им. Ломоносова' },
  { key: 'МГППУ', display: 'МГППУ' },
  { key: 'Шанинка', display: 'МВШСЭН (Шанинка)' },
  { key: 'Сеченова', display: 'Первый МГМУ им. Сеченова' },
  { key: 'СПбГУ', display: 'СПбГУ' },
];

// 1. Безопасный поиск университета с гарантированным фолбеком
const extractUniversity = (psychologist: any): string => {
  const rawEducation = 
    psychologist.university_abbr || 
    psychologist.university || 
    psychologist.education || 
    psychologist.edu ||
    '';

  if (typeof rawEducation === 'string' && rawEducation.trim() !== '') {
    for (const item of KNOWN_UNIVERSITIES) {
      if (rawEducation.toLowerCase().includes(item.key.toLowerCase())) {
        return item.display;
      }
    }
    return rawEducation;
  }

  // Если данных вообще нет — жестко берем первый вуз из списка (НИУ ВШЭ)
  return KNOWN_UNIVERSITIES[0].display; 
};

// 2. Безопасное получение подходов
const extractMethods = (psychologist: any): string[] => {
  const methods = psychologist.methods || psychologist.approaches || psychologist.specialties;
  if (Array.isArray(methods) && methods.length > 0) {
    return methods;
  }
  return ['КПТ', 'Гештальт-терапия'];
};

const getHoursWord = (hours: number) => {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'часов';
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
};

  export default function PsychologistCard({ psychologist, onSelect }: PsychologistCardProps) {
  const universityDisplay = extractUniversity(psychologist);
  const methodsDisplay = extractMethods(psychologist);
  const supervisionHours = psychologist.supervision_hours || 40;
  // Жестко хардкодим 1500 ₽, если цена в базе больше 1500 или равна нулю
  const originalPrice = Number(psychologist.price_per_session) || 0;
  const finalPrice = (originalPrice > 1500 || originalPrice === 0) ? 1500 : originalPrice;

  return (
    <button
      onClick={() => onSelect(psychologist)}
      className="group text-left bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col h-full w-full"
    >
      {/* Контейнер для фото */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden flex-shrink-0">
        {psychologist.photo_url ? (
          <img
            src={psychologist.photo_url}
            alt={psychologist.name}
            className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 will-change-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
            <span className="text-5xl font-bold text-amber-500 select-none">
              {psychologist.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{psychologist.name}</h3>
        <p className="text-sm text-amber-600 font-medium mb-3 line-clamp-1">{psychologist.title}</p>

        {/* Направления/Специализации */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
          {psychologist.specialties && psychologist.specialties.length > 0 ? (
            psychologist.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap"
              >
                {s}
              </span>
            ))
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
              Психология
            </span>
          )}
        </div>

        {/* Университет и Подходы */}
        <div className="flex flex-col gap-2 mb-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium text-slate-700" title={universityDisplay}>
              {universityDisplay}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 text-slate-600">
              <span className="font-medium text-slate-400">Подходы:</span>{' '}
              {methodsDisplay.join(', ')}
            </span>
          </div>
        </div>

        {/* Часы супервизии */}
        <div className="flex items-center gap-3 mb-4 mt-auto text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="font-semibold text-slate-700">{supervisionHours}</strong>{' '}
              {getHoursWord(supervisionHours)} супервизии
            </span>
          </span>
        </div>

        {/* Отображение захардкоженной или корректной цены */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-2xl font-bold text-slate-800">
              {finalPrice}
            </span>
            <span className="text-sm text-slate-400 ml-1">₽</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 group-hover:text-amber-700 transition-colors">
            Подробнее
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
}
