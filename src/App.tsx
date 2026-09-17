import { useState } from 'react';
import type { Psychologist, View, BookingData } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/components/HomePage';
import DetailPage from '@/components/DetailPage';
import PaymentPage from '@/components/PaymentPage';
import ConfirmationPage from '@/components/ConfirmationPage';
import AgreementPage from '@/components/AgreementPage'; // 👈 Добавили импорт страницы соглашения

function App() {
  const [view, setView] = useState<View>('home');
  const [prevView, setPrevView] = useState<View>('home'); // 👈 Добавили стейт для сохранения предыдущего экрана
  const [selected, setSelected] = useState<Psychologist | null>(null);
  const [booking, setBooking] = useState<BookingData | null>(null);

  const handleNavigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelect = (p: Psychologist) => {
    setSelected(p);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSchedule = (p: Psychologist) => {
    setView('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePay = (data: BookingData) => {
    setBooking(data);
    setView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 👈 Добавили функцию для открытия пользовательского соглашения из Футера
  const handleOpenAgreement = () => {
    setPrevView(view); // Запоминаем страницу, на которой стоял пользователь
    setView('agreement'); // Переключаем экран
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header view={view} onNavigate={handleNavigate} />

      <main className="flex-1">
        {view === 'home' && <HomePage onSelect={handleSelect} />}
        {view === 'detail' && selected && (
          <DetailPage psychologist={selected} onSchedule={handleSchedule} />
        )}
        {view === 'payment' && selected && (
          <PaymentPage psychologist={selected} onPay={handlePay} onBack={() => setView('detail')} />
        )}
        {view === 'confirmation' && booking && (
          <ConfirmationPage booking={booking} onHome={() => handleNavigate('home')} />
        )}
        
        {/* 🚨 ИСПРАВЛЕНО: Заменили setView(prevView) на жесткий возврат на главную страницу 'home' */}
        {view === 'agreement' && (
          <AgreementPage onBack={() => handleNavigate('home')} />
        )}
      </main>

      {/* 🚨 ИСПРАВЛЕНО: передаем функцию клика в компонент Футера */}
      <Footer onOpenAgreement={handleOpenAgreement} />
    </div>
  );
}

export default App;
