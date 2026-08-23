'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookItem } from '@/lib/supabase';
import StarRating from './StarRating';
import BookReaderModal from './BookReaderModal';
import { forceDownload } from '@/lib/forceDownload';

export default function BookGrid({ books }: { books: BookItem[] }) {
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);

  function openBook(book: BookItem) {
    // Mobile browsers reliably render a PDF when navigating to it directly
    // (their built-in viewer), but very often refuse to render one embedded
    // inside an iframe on another page - that's what made "Read" seem to
    // do nothing on phones. So on mobile we skip the in-page modal and
    // just open the PDF itself in a new tab; desktop keeps the nicer
    // in-modal reader.
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      window.open(book.pdf_url, '_blank', 'noopener,noreferrer');
    } else {
      setActiveBook(book);
    }
  }

  if (books.length === 0) {
    return <p className="text-sm text-inksoft italic">No books added yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {books.map((book) => (
          <div
            key={book.id}
            data-search-id={book.id}
            className="group glass-card rounded-2xl p-3 sm:p-4 card-shadow cursor-pointer border border-borderpink transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-200 flex flex-col"
            onClick={() => openBook(book)}
          >
            <div className="relative w-full aspect-[3/4] rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-3xl overflow-hidden shadow-md mb-3">
              {book.cover_image_url ? (
                <Image
                  src={book.cover_image_url}
                  alt={book.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                '📖'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-0.5 line-clamp-2 leading-snug">
                {book.title}
              </h4>
              {book.author && (
                <p className="text-[11px] text-inksoft/70 mb-1 truncate">by {book.author}</p>
              )}
              <StarRating rating={book.rating} />
            </div>

            <div className="flex gap-1.5 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  forceDownload(book.pdf_url, `${book.title}.pdf`);
                }}
                className="flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors truncate"
              >
                ↓ Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openBook(book);
                }}
                className="flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-sm truncate"
              >
                Read
              </button>
            </div>
          </div>
        ))}
      </div>

      <BookReaderModal book={activeBook} onClose={() => setActiveBook(null)} />
    </>
  );
}
