'use client';

import { useEffect, useState } from 'react';
import { fetchSurahList, SurahMeta } from '@/lib/quran';
import SurahReader from './SurahReader';

export default function FullQuranSection() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeSurah, setActiveSurah] = useState<number | null>(null);

  useEffect(() => {
    fetchSurahList()
      .then(setSurahs)
      .finally(() => setLoading(false));
  }, []);

  if (activeSurah !== null) {
    return <SurahReader surahNumber={activeSurah} onClose={() => setActiveSurah(null)} />;
  }

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      String(s.number).includes(search)
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search a surah by name or number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-borderpink rounded-full px-5 py-3 text-sm mb-6 max-w-md"
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-inksoft text-sm">
          <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin" />
          Loading the Holy Quran...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <button
              key={s.number}
              onClick={() => setActiveSurah(s.number)}
              className="glass-card border border-borderpink rounded-2xl p-5 text-left card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pink-400/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold flex items-center justify-center mb-2">
                    {s.number}
                  </span>
                  <h4 className="text-base">{s.englishName}</h4>
                  <p className="text-xs text-inksoft">{s.englishNameTranslation}</p>
                  <p className="text-[11px] text-inksoft/70 mt-1">
                    {s.numberOfAyahs} verses &middot; {s.revelationType}
                  </p>
                </div>
                <p className="quote text-2xl text-pink-600">{s.name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
