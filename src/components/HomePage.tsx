import { useEffect, useState } from 'react';
import { Sun, Loader2, ChevronDown } from 'lucide-react';
import type { Psychologist } from '@/types';
import { supabase } from '@/lib/supabase';
import PsychologistCard from './PsychologistCard';

interface HomePageProps {
  onSelect: (p: Psychologist) => void;
}

const UNIVERSITIES = [
  { value: 'Все вузы', label: 'Все университеты' },
  { value: 'НИУ ВШЭ', label: 'НИУ ВШЭ' },
  { value: 'МГУ им. Ломоносова', label: 'МГУ им. Ломоносова' },
  { value: 'СПбГУ', label: 'СПбГУ' },
  { value: 'МГППУ', label: 'МГППУ' },
  { value: 'МВШСЭН (Шанинка)', label: 'МВШСЭН (Шанинка)' },
  { value: 'Первый МГМУ им. Сеченова', label: 'Первый МГМУ им. Сеченова' }
];

const APPROACHES = [
  { value: 'Все подходы', label: 'Все подходы' },
  { value: 'КПТ', label: 'Когнитивно-поведенческая (КПТ)' },
  { value: 'Гештальт', label: 'Гештальт-терапия' },
  { value: 'АСТ', label: 'Терапия принятия (ACT)' },
  { value: 'Психоанализ', label: 'Психоанализ' },
  { value: 'ЭФТ', label: 'Эмоционально-фокусированная (ЭФТ)' }
];

// Обновили плашку цен под ваши реальные данные в базе (от 2800 до 5000 ₽)
const PRICE_RANGES = [
  { value: 'Любая цена', label: 'Любая стоимость' },
  { value: 'До 3000 ₽', label: 'До 3 000 ₽' },
  { value: 'До 4000 ₽', label: 'До 4 000 ₽' },
  { value: 'До 5000 ₽', label: 'До 5 000 ₽' }
];

export default function HomePage({ onSelect }: HomePageProps) {
  const [list, setList] = useState<any[]>([]);
  const [filteredList, setFilteredList] = useState<any[]>([]);
  
  const [selectedUni, setSelectedUni] = useState('Все вузы');
  const [selectedApproach, setSelectedApproach] = useState('Все подходы');
  const [selectedPrice, setSelectedPrice] = useState('Любая цена');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Запрос к вашей таблице в Supabase
      const { data, error } = await supabase.from('psychologists').select('*');
      if (error) {
        console.error("Ошибка получения данных из Supabase:", error.message);
      }
      const loadedData = data || [];
      setList(loadedData);
      setFilteredList(loadedData);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    let result = list;

    // 1. Мягкий фильтр по вузам (не ломает код, если поле пустое)
    if (selectedUni !== 'Все вузы') {
      result = result.filter(p => {
        const uniField = p.university || (p.education && p.education.join(' '));
        return uniField && uniField.toLowerCase().includes(selectedUni.toLowerCase());
      });
    }

    // 2. ИСПРАВЛЕНО: Меняем p.approach на p.approaches (массив из вашей базы данных)
    if (selectedApproach !== 'Все подходы') {
      result = result.filter(p => p.approaches && p.approaches.includes(selectedApproach));
    }
    // 3. ИСПРАВЛЕНО: Меняем p.price на p.price_per_session под структуру миграции
    if (selectedPrice !== 'Любая цена') {
      const maxPrice = selectedPrice === 'До 3000 ₽' ? 3000 : selectedPrice === 'До 4000 ₽' ? 4000 : 5000;
      result = result.filter(p => p.price_per_session && p.price_per_session <= maxPrice);
    }

    setFilteredList(result);
  }, [selectedUni, selectedApproach, selectedPrice, list]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFFDF9]">
        <Loader2 className="w-8 h-8 text-[#E2953B] animate-spin" />
        <span className="ml-3 text-[#4A3E3D] font-medium">Загрузка специалистов из базы данных...</span>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-white text-[#4A3E3D] font-sans">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9EE] to-white border-b border-orange-100/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FFE7C4]/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#FFF2D4]/40 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100 mb-8 shadow-sm">
            <Sun className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] font-bold text-[#4A3E3D] tracking-widest uppercase">
              ЛУЧИК • Сервис доступной психотерапии
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4A3E3D] tracking-widest uppercase mb-5 max-w-3xl mx-auto leading-tight">
            Выбери своего психолога
          </h1>

          <p className="text-base text-[#565C66] leading-relaxed max-w-2xl mx-auto mb-8">
            Психологические консультации со специалистами из{' '}
            <span className="text-[#E2953B] font-semibold">ведущих университетов</span>.{' '}
            Стоимость сессии — <span className="font-semibold text-[#4A3E3D]">до 1 500 рублей</span>.
          </p>

          {/* БЛОК: Отбор психологов для молодой аудитории */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl mx-auto mb-8 text-left shadow-sm">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Как мы отбираем специалистов?</h3>
              <p className="text-xs text-slate-400">
                Мы даем старт молодым и талантливым профессионалам, но подходим к проверке максимально серьезно.
              </p>
            </div>

            {/* Базовая сетка на 6 колонок для десктопа */}
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
              
              {/* СВЕРХУ: Блок 1 (33% ширины) */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/60 sm:col-span-2">
                <div className="text-xl mb-1.5">🎓</div>
                <div className="text-sm font-bold text-slate-800 mb-1">Высшее образование во главе</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Никаких двухнедельных курсов. Только полноценный диплом психолога от ведущих вузов страны.
                </p>
              </div>

              {/* СВЕРХУ: Блок 2 (33% ширины) */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/60 sm:col-span-2">
                <div className="text-xl mb-1.5">⚡</div>
                <div className="text-sm font-bold text-slate-800 mb-1">500+ часов метода</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Глубоко знают свой подход (КПТ, гештальт-терапия, АКТ / ACT, КПЦ или схема-терапия) и отработали в нем сотни часов практики до выхода к клиентам.
                </p>
              </div>

              {/* СВЕРХУ: Блок 3 (33% ширины) */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/60 sm:col-span-2">
                <div className="text-xl mb-1.5">🤝</div>
                <div className="text-sm font-bold text-slate-800 mb-1">Под супервизией</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Проверяем обязательное наличие часов регулярной супервизии и запрашиваем рекомендательные письма от старших коллег, наставников и супервизоров.
                </p>
              </div>

              {/* СНИЗУ: Блок 4 (50% ширины, идет параллельно с Блоком 5) */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/60 sm:col-span-3">
                <div className="text-xl mb-1.5">🎯</div>
                <div className="text-sm font-bold text-slate-800 mb-1">Собеседование в несколько шагов</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  На практике тестируем их базовые навыки в рамках подхода. Тщательно проверяем совпадение по ценностям: здесь только про бережность, экологичность и абсолютную конфиденциальность.
                </p>
              </div>

              {/* СНИЗУ: Блок 5 (50% ширины, идет параллельно с Блоком 4) */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-100/60 sm:col-span-3">
                <div className="text-xl mb-1.5">🌱</div>
                <div className="text-sm font-bold text-slate-800 mb-1">1000+ часов личной терапии</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Наши специалисты прошли углубленный цикл клиентского опыта в своем терапевтическом подходе. Это гарантирует высокий уровень эмоциональной устойчивости: психолог полностью разделяет свои процессы и ваши запросы, обеспечивая безопасное пространство без проекций и осуждения.
                </p>
              </div>

            </div>
          </div>


          {/* Блок фильтров на экране */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm">
            {/* Селектор вузов */}
            <div className="relative">
              <select 
                value={selectedUni} 
                onChange={(e) => setSelectedUni(e.target.value)}
                className="w-full p-3 bg-white border border-orange-100 rounded-xl appearance-none text-sm text-[#4A3E3D] focus:outline-none focus:border-[#E2953B]"
              >
                {UNIVERSITIES.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-[#A6958E] pointer-events-none" />
            </div>

            {/* Селектор подходов */}
            <div className="relative">
              <select 
                value={selectedApproach} 
                onChange={(e) => setSelectedApproach(e.target.value)}
                className="w-full p-3 bg-white border border-orange-100 rounded-xl appearance-none text-sm text-[#4A3E3D] focus:outline-none focus:border-[#E2953B]"
              >
                {APPROACHES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-[#A6958E] pointer-events-none" />
            </div>

            {/* Селектор цен */}
            <div className="relative">
              <select 
                value={selectedPrice} 
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full p-3 bg-white border border-orange-100 rounded-xl appearance-none text-sm text-[#4A3E3D] focus:outline-none focus:border-[#E2953B]"
              >
                {PRICE_RANGES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-[#A6958E] pointer-events-none" />
            </div>
          </div>

          {/* Список психологов */}
          <div className="mt-16 max-w-5xl mx-auto px-4">
            {filteredList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((psychologist) => (
                  <PsychologistCard
                    key={psychologist.id}
                    psychologist={psychologist}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 p-8 bg-[#FFFDF9] rounded-2xl border border-dashed border-orange-200">
                <p className="text-[#565C66]">Специалисты с такими параметрами не найдены. Попробуйте сбросить фильтры.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
