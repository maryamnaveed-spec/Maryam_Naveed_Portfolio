'use client';

import { useState } from 'react';
import { BookItem } from '@/lib/supabase';
import BookGrid from './BookGrid';

export default function LibrarySection({ books }: { books: BookItem[] }) {
  const [lang, setLang] = useState<'English' | 'Urdu'>('English');

  const filtered = books.filter((b) => b.language === lang);

  return (
    <div>
      <div className="flex gap-2 mb-7 bg-pink-50 p-1 rounded-full w-fit">
        {(['English', 'Urdu'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-colors ${
              lang === l ? 'bg-white shadow text-pink-600' : 'text-inksoft'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <BookGrid books={filtered} />
    </div>
  );
}
