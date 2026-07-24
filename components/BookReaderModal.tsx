'use client';

import { useEffect, useState } from 'react';
import { BookItem } from '@/lib/supabase';
import { forceDownload } from '@/lib/forceDownload';
import ModalPortal from './ModalPortal';
import CommentsBox from './CommentsBox';

export default function BookReaderModal({
  book,
  onClose
}: {
  book: BookItem | null;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
  }, []);

  if (!book) return null;

  function handleDownload() {
    if (!book) return;
    forceDownload(book.pdf_url, `${book.title}.pdf`);
  }

  // Desktop browsers render PDFs natively and instantly inside an iframe -
  // no extra viewer app to download, so it opens as fast as possible.
  // Mobile browsers generally can't render PDFs inline, so we fall back to
  // Mozilla's PDF.js viewer only there (it was already warmed up by a
  // prefetch hint when the user hovered/tapped the book card).
  const viewerUrl = isMobile
    ? `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(book.pdf_url)}`
    : `${book.pdf_url}#toolbar=1&view=FitH`;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/55 flex items-center justify-center z-[100] sm:p-5 animate-[fadeIn_0.15s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-[#FFFDF9] w-full h-full sm:h-[85vh] sm:max-w-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-[zoomIn_0.2s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-borderpink">
            <h4 className="text-base sm:text-lg truncate pr-3">{book.title}</h4>
            <button
              onClick={onClose}
              className="text-inksoft text-2xl leading-none hover:text-pink-600 flex-shrink-0"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 relative bg-[#FFFDF9] min-h-0">
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-inksoft text-sm overflow-hidden">
                {book.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.cover_image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
                  loading="lazy" />
                )}
                <div className="relative w-8 h-8 rounded-full border-2 border-pink-200 border-t-pink-600 animate-spin" />
                <span className="relative">Opening book...</span>
              </div>
            )}
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              title={book.title}
              onLoad={() => setLoaded(true)}
            />
          </div>

          {showComments && (
            <div className="max-h-56 overflow-y-auto px-4 sm:px-5 py-3 border-t border-borderpink bg-pink-50/40">
              <CommentsBox itemType="book" itemId={book.id} itemTitle={book.title} />
            </div>
          )}

          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-borderpink">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
            >
              💬 {showComments ? 'Hide views' : 'Reader views'}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600"
            >
              ↓ Download PDF
            </button>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </ModalPortal>
  );
}
