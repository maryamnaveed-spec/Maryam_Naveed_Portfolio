'use client';

import { useState } from 'react';
import { BookItem } from '@/lib/supabase';
import StarRating from './StarRating';
import BookReaderModal from './BookReaderModal';
import { forceDownload } from '@/lib/forceDownload';

export default function BookGrid({ books }: { books: BookItem[] }) {
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);

  if (books.length === 0) {
    return <p className="text-sm text-inksoft italic">No books added yet.</p>;
  }

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="group glass-card rounded-2xl p-5 card-shadow flex gap-4 cursor-pointer border border-borderpink transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pink-200"
            onClick={() => setActiveBook(book)}
          >
            <div className="w-20 h-28 rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl overflow-hidden shadow-md">
              {book.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy" />
              ) : (
                '📖'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold mb-0.5 truncate">{book.title}</h4>
              {book.author && (
                <p className="text-xs text-inksoft/70 mb-1">by {book.author}</p>
              )}
              <StarRating rating={book.rating} />

              {book.review && (
                <div className="mt-2 mb-3 pl-3 border-l-2 border-pink-200">
                  <p className="text-[13px] text-ink/80 italic leading-relaxed">
                    &ldquo;{book.review}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    forceDownload(book.pdf_url, `${book.title}.pdf`);
                  }}
                  className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors"
                >
                  ↓ Download
                </button>
                <button className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-sm">
                  Read online
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BookReaderModal book={activeBook} onClose={() => setActiveBook(null)} />
    </>
  );
}
