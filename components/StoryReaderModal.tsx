'use client';

import { StoryItem } from '@/lib/supabase';
import { forceDownload } from '@/lib/forceDownload';
import ModalPortal from './ModalPortal';
import PdfViewer from './PdfViewer';

export default function StoryReaderModal({
  story,
  onClose
}: {
  story: StoryItem | null;
  onClose: () => void;
}) {
  if (!story) return null;

  function handleDownload() {
    if (!story) return;
    forceDownload(story.pdf_url, `${story.title}.pdf`);
  }

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
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-borderpink flex-shrink-0">
            <h4 className="text-base sm:text-lg truncate pr-3">{story.title}</h4>
            <button
              onClick={onClose}
              className="text-inksoft text-2xl leading-none hover:text-pink-600 flex-shrink-0"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <PdfViewer url={story.pdf_url} />
          </div>

          <div className="flex items-center justify-end px-4 sm:px-5 py-3 border-t border-borderpink flex-shrink-0">
            <button
              onClick={handleDownload}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
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
