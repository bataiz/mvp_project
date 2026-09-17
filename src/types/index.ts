export interface Psychologist {
  id: string;                          // uuid — в TypeScript это строка (string)
  name: string;                        // text
  photo_url?: string | null;           // text, Nullable
  title: string;                       // text
  bio: string;                         // text
  specialties: string[];               // _text (массив строк)
  approaches: string[];                // _varchar (массив строк)
  price_per_session: number;           // int4 (число)
  experience_years: number;            // int4 (число)
  is_available: boolean;               // bool (true/false)
  is_featured: boolean;                // bool (true/false)
  created_at?: string | null;          // timestamptz, Nullable
  university: string | null;          // varchar, Nullable
  supervision_hours: number;
  practice_hours: number;
}


export type View = 'home' | 'detail' | 'payment' | 'confirmation'|'agreement';

export interface BookingData {
  psychologist: Psychologist;
  clientName: string;
  clientEmail: string;
  telegram: string
}
