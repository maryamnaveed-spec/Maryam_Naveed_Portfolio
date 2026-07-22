'use client';

import { useState } from 'react';
import { PUNJ_SURAH_NUMBERS } from '@/lib/quran';
import SurahReader from './SurahReader';

const LABELS: Record<number, string> = {
  1: 'Al-Fatiha',
  108: 'Al-Kausar',
  112: 'Al-Ikhlas',
  113: 'Al-Falaq',
  114: 'An-Nas'
};

export default function PunjSurahSection() {
  const [index, setIndex] = useState(0);
  const surahNumber = PUNJ_SURAH_NUMBERS[index];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {PUNJ_SURAH_NUMBERS.map((num, i) => (
          <button
            key={num}
            onClick={() => setIndex(i)}
            className={`text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
              index === i
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white border-transparent shadow-md shadow-pink-400/25'
                : 'border-borderpink text-inksoft hover:bg-pink-50'
            }`}
          >
            {LABELS[num]}
          </button>
        ))}
      </div>

      <SurahReader key={surahNumber} surahNumber={surahNumber} />

      <div className="flex items-center justify-between mt-5">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 disabled:opacity-40"
        >
          ← Previous surah
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(PUNJ_SURAH_NUMBERS.length - 1, i + 1))}
          disabled={index === PUNJ_SURAH_NUMBERS.length - 1}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 disabled:opacity-40"
        >
          Next surah →
        </button>
      </div>
    </div>
  );
}
