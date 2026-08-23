'use client';

import Image from 'next/image';
import { ArtItem } from '@/lib/supabase';
import CommentsBox from './CommentsBox';
import ModalPortal from './ModalPortal';

export default function ImageLightbox({
  item,
  onClose
}: {
  item: ArtItem | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/70 flex items-center justify-center z-[200] p-6 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
      <div
        className="bg-surface rounded-2xl overflow-hidden shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-[zoomIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-pink-50">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-contain"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-inksoft text-xl leading-none flex items-center justify-center hover:bg-white"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            {item.category}
          </span>
          <h4 className="text-xl mt-2 mb-1">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-inksoft">{item.description}</p>
          )}
          <CommentsBox itemType="art" itemId={item.id} itemTitle={item.title} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      </div>
    </ModalPortal>
  );
}
