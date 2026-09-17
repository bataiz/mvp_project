import { CheckCircle2, Mail, Send, Home as HomeIcon } from 'lucide-react';
import type { BookingData } from '@/types';

interface ConfirmationPageProps {
  booking: BookingData;
  onHome: () => void;
}

export default function ConfirmationPage({ booking, onHome }: ConfirmationPageProps) {
  const p = booking.psychologist;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5 animate-bounce-slow">
            <CheckCircle2 className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Заявка принята!
          </h1>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Психолог свяжется с вами по почте или в Telegram в течение одного дня для согласования даты и времени.
          </p>
        </div>

        {/* Booking details */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
          <div className="flex items-center gap-4 p-5 border-b border-slate-100">
            {p.photo_url && (
              <img
                src={p.photo_url}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
            )}
            <div>
              <h3 className="font-bold text-slate-800">{p.name}</h3>
              <p className="text-sm text-amber-600">{p.title}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Ваш Email</p>
                <p className="text-sm font-bold text-slate-700">{booking.clientEmail}</p>
              </div>
            </div>

            {booking.telegram && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Send className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ваш Telegram</p>
                  <p className="text-sm font-bold text-slate-700">{booking.telegram}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onHome}
          className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-amber-300 hover:text-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          <HomeIcon className="w-5 h-5" />
          На главную
        </button>
      </div>
    </div>
  );
}
