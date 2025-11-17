'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full p-1 shadow-lg">
      <button
        onClick={() => setLocale('ja')}
        className={`px-4 py-2 rounded-full font-semibold transition-all ${
          locale === 'ja'
            ? 'bg-white text-black shadow-md scale-105'
            : 'text-white hover:bg-white/10'
        }`}
      >
        日本語
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-4 py-2 rounded-full font-semibold transition-all ${
          locale === 'en'
            ? 'bg-white text-black shadow-md scale-105'
            : 'text-white hover:bg-white/10'
        }`}
      >
        English
      </button>
    </div>
  );
}
