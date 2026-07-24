'use client';

import { useState } from 'react';
import { ArtItem, BookItem } from '@/lib/supabase';

export default function HighlightsSection({
  featuredArt,
  featuredBook
}: {
  featuredArt: ArtItem | null;
  featuredBook: BookItem | null;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Artwork of the Week */}
      <div className="glass-card border border-borderpink rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-pink-400/50">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            Artwork of the Week
          </span>
          <span className="text-lg">✨</span>
        </div>
        {featuredArt ? (
          <>
            <div className="relative w-full h-48 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredArt.image_url}
                alt={featuredArt.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            </div>
            <div className="p-5">
              <h4 className="text-lg">{featuredArt.title}</h4>
              <p className="text-xs text-pink-600 font-semibold mt-1">{featuredArt.subcategory}</p>
            </div>
          </>
        ) : (
          <div className="p-5 text-sm text-inksoft italic">No artwork yet.</div>
        )}
      </div>

      {/* Book of the Month */}
      <div className="glass-card border border-borderpink rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-pink-400/50">
        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            Book of the Month
          </span>
          <span className="text-lg">📖</span>
        </div>
        {featuredBook ? (
          <div className="p-5 flex gap-5 items-center">
            <div className="w-20 h-28 rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl overflow-hidden shadow-lg shadow-pink-400/30 transition-transform duration-300 hover:scale-105">
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

    </div>
  );
}
