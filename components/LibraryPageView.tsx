'use client';

import { useState } from 'react';
import { BookItem, AudioBookItem } from '@/lib/supabase';
import BookGrid from './BookGrid';
import AudioBookGrid from './AudioBookGrid';

export default function LibraryPageView({
  books,
  audioBooks
}: {
  books: BookItem[];
  audioBooks: AudioBookItem[];
}) {
  const [tab, setTab] = useState<'books' | 'audio'>('books');
  const [lang, setLang] = useState<'English' | 'Urdu'>('English');

  const filteredBooks = books.filter((b) => b.language === lang);

  return (
    <div>
      <div className="flex justify-center mb-7">
        <div className="flex gap-1.5 bg-pink-50 p-1.5 rounded-full">
          <button
            onClick={() => setTab('books')}
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
              tab === 'books' ? 'bg-white shadow text-pink-600' : 'text-inksoft'
            }`}
          >
            📚 Books
          </button>
          <button
            onClick={() => setTab('audio')}
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all ${
              tab === 'audio' ? 'bg-white shadow text-pink-600' : 'text-inksoft'
            }`}
          >
            🎧 Audiobooks
          </button>
        </div>
      </div>

      {tab === 'books' && (
        <div>
          <div className="flex justify-center gap-2 mb-7">
            {(['English', 'Urdu'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-colors ${
                  lang === l
                    ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white border-transparent shadow-sm'
                    : 'border-borderpink text-inksoft hover:bg-pink-50'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {filteredBooks.length === 0 ? (
            <p className="text-center text-inksoft/70 italic py-16">
              No {lang} books added yet — check back soon.
            </p>
          ) : (
            <BookGrid books={filteredBooks} />
          )}
        </div>
      )}

      {tab === 'audio' && <AudioBookGrid books={audioBooks} />}
    </div>
  );
}
