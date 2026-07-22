'use client';

import { useEffect, useRef, useState } from 'react';
import {
  fetchSurahDetail,
  ayahAudioUrl,
  surahAudioUrl,
  SurahDetail
} from '@/lib/quran';

const AYAHS_PER_PAGE = 5;

export default function SurahReader({
  surahNumber,
  onClose
}: {
  surahNumber: number;
  onClose?: () => void;
}) {
  const [detail, setDetail] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipping, setFlipping] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLoading(true);
    setPage(0);
    fetchSurahDetail(surahNumber)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [surahNumber]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, [surahNumber]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-inksoft text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin" />
        Loading surah...
      </div>
    );
  }

  if (!detail) return null;

  const totalPages = Math.ceil(detail.arabicAyahs.length / AYAHS_PER_PAGE);
  const start = page * AYAHS_PER_PAGE;
  const arabicSlice = detail.arabicAyahs.slice(start, start + AYAHS_PER_PAGE);
  const urduSlice = detail.urduAyahs.slice(start, start + AYAHS_PER_PAGE);

  function goToPage(newPage: number) {
    if (newPage < 0 || newPage >= totalPages || flipping) return;
    setFlipDirection(newPage > page ? 'next' : 'prev');
    setFlipping(true);
    setTimeout(() => {
      setPage(newPage);
      setFlipping(false);
    }, 220);
  }

  function playAyah(globalNumber: number) {
    audioRef.current?.pause();
    const audio = new Audio(ayahAudioUrl(globalNumber));
    audioRef.current = audio;
    setPlayingAyah(globalNumber);
    audio.play();
    audio.onended = () => setPlayingAyah(null);
  }

  function playFullSurah() {
    audioRef.current?.pause();
    const audio = new Audio(surahAudioUrl(surahNumber));
    audioRef.current = audio;
    setPlayingAyah(-1);
    audio.play();
    audio.onended = () => setPlayingAyah(null);
  }

  return (
    <div className="glass-card border border-borderpink rounded-3xl overflow-hidden card-shadow">
      {/* Header */}
      <div className="bg-gradient-to-br from-ink to-[#5A2E4A] text-white px-5 sm:px-6 py-5 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/70 text-xs font-semibold mb-2 hover:text-white"
            >
              ← Back to list
            </button>
          )}
          <h2 className="text-xl sm:text-2xl font-display">{detail.meta.englishName}</h2>
          <p className="text-goldlight/80 text-xs sm:text-sm">
            {detail.meta.englishNameTranslation} &middot; {detail.meta.numberOfAyahs} verses &middot;{' '}
            {detail.meta.revelationType}
          </p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <p className="quote text-2xl sm:text-3xl text-goldlight">{detail.meta.name}</p>
          <button
            onClick={playFullSurah}
            className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white whitespace-nowrap"
          >
            {playingAyah === -1 ? '⏸ Playing surah' : '▶ Listen to full surah'}
          </button>
        </div>
      </div>

      {/* Page (flip effect) */}
      <div
        className="p-5 sm:p-10 min-h-[380px] transition-all duration-200"
        style={{
          opacity: flipping ? 0 : 1,
          transform: flipping
            ? `rotateY(${flipDirection === 'next' ? '-8deg' : '8deg'}) scale(0.98)`
            : 'rotateY(0deg) scale(1)',
          transformOrigin: flipDirection === 'next' ? 'left center' : 'right center'
        }}
      >
        <div className="space-y-7">
          {arabicSlice.map((ayah, i) => (
            <div key={ayah.number} className="border-b border-borderpink pb-6 last:border-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="w-7 h-7 flex-shrink-0 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold flex items-center justify-center">
                  {ayah.numberInSurah}
                </span>
                <button
                  onClick={() => playAyah(ayah.number)}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 flex-shrink-0"
                >
                  {playingAyah === ayah.number ? '⏸' : '▶'} Listen
                </button>
              </div>
              <p
                dir="rtl"
                className="text-right text-2xl sm:text-3xl leading-[2.2] font-display mb-3"
                style={{ fontFamily: "'Traditional Arabic', 'Amiri', serif" }}
              >
                {ayah.text}
              </p>
              <p dir="rtl" className="text-right text-base text-inksoft leading-loose">
                {urduSlice[i]?.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-borderpink bg-pink-50/40">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 disabled:opacity-40"
        >
          ← Previous page
        </button>
        <span className="text-xs text-inksoft">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages - 1}
          className="text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 disabled:opacity-40"
        >
          Next page →
        </button>
      </div>
    </div>
  );
}
