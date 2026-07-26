'use client';

import { ArtItem, BookItem } from '@/lib/supabase';

export default function HighlightsSection({
  featuredArt,
  featuredBook,
  quote
}: {
  featuredArt: ArtItem | null;
  featuredBook: BookItem | null;
  quote: string;
}) {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {/* Artwork of the Week */}
      <div className="group relative glass-card border border-borderpink rounded-2xl overflow-hidden card-shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-pink-400/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-gold to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            Artwork of the Week
          </span>
          <span className="text-lg spark-pulse">✨</span>
        </div>
        {featuredArt ? (
          <>
            <div className="relative w-full h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredArt.image_url}
                alt={featuredArt.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent" />
              <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wide text-white bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
                {featuredArt.subcategory}
              </span>
            </div>
            <div className="p-5">
              <h4 className="text-lg">{featuredArt.title}</h4>
            </div>
          </>
        ) : (
          <div className="p-5 text-sm text-inksoft italic">No artwork yet.</div>
        )}
      </div>

      {/* Book of the Month */}
      <div className="group relative glass-card border border-borderpink rounded-2xl overflow-hidden card-shadow transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-pink-400/60">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-gold to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            Book of the Month
          </span>
          <span className="text-lg">📖</span>
        </div>
        {featuredBook ? (
          <div className="p-5 flex gap-5 items-center">
            <div className="w-20 h-28 rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl overflow-hidden shadow-lg shadow-pink-400/30 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
              {featuredBook.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredBook.cover_image_url}
                  alt={featuredBook.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                '📖'
              )}
            </div>
            <div>
              <h4 className="text-lg">{featuredBook.title}</h4>
              {featuredBook.author && (
                <p className="text-xs text-inksoft mt-0.5">{featuredBook.author}</p>
              )}
              <p className="text-sm text-gold mt-2">{'★'.repeat(featuredBook.rating)}</p>
            </div>
          </div>
        ) : (
          <div className="p-5 text-sm text-inksoft italic">No books yet.</div>
        )}
      </div>

      {/* Quote of the Day */}
      <div className="group relative glass-card border border-borderpink rounded-2xl p-6 card-shadow flex flex-col justify-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-pink-400/60 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-gold to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="pointer-events-none absolute -right-4 -bottom-6 text-8xl text-pink-400/10 select-none quote-mark">
          &rdquo;
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full w-fit mb-4 relative">
          Quote of the Day
        </span>
        <p className="quote text-2xl text-ink leading-snug relative">&ldquo;{quote}&rdquo;</p>
      </div>

      <style jsx global>{`
        .spark-pulse {
          animation: sparkPulse 2.4s ease-in-out infinite;
        }
        @keyframes sparkPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.25) rotate(10deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
