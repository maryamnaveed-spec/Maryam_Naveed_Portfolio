'use client';

import { BlogItem } from '@/lib/supabase';
import ModalPortal from './ModalPortal';

export default function BlogModal({
  blog,
  onClose
}: {
  blog: BlogItem | null;
  onClose: () => void;
}) {
  if (!blog) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/55 flex items-center justify-center z-[200] p-5 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-surface w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-[zoomIn_0.25s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          {blog.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="w-full h-56 object-cover"
            />
          )}
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-2xl">{blog.title}</h3>
              <button
                onClick={onClose}
                className="text-inksoft text-2xl leading-none hover:text-pink-600 flex-shrink-0"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <p className="text-xs text-inksoft/70 mb-5">
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="text-[15px] text-inksoft leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </ModalPortal>
  );
}
