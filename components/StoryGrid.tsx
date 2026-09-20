'use client';

import { useState } from 'react';
import { StoryItem } from '@/lib/supabase';
import StoryReaderModal from './StoryReaderModal';
import { forceDownload } from '@/lib/forceDownload';
import ModalPortal from './ModalPortal';

function StoryVideoModal({ story, onClose }: { story: StoryItem; onClose: () => void }) {
  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/70 flex items-center justify-center z-[200] p-5 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-surface rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full animate-[zoomIn_0.25s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-borderpink">
            <h4 className="text-sm font-semibold truncate pr-3">{story.title}</h4>
            <button
              onClick={onClose}
              className="text-inksoft text-xl leading-none hover:text-pink-600 flex-shrink-0"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={story.video_url ?? undefined}
            controls
            autoPlay
            className="w-full max-h-[75vh] bg-black"
          />
        </div>
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </ModalPortal>
  );
}

export default function StoryGrid({ stories }: { stories: StoryItem[] }) {
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [videoStory, setVideoStory] = useState<StoryItem | null>(null);

  function openStory(story: StoryItem) {
    setActiveStory(story);
  }

  if (stories.length === 0) {
    return (
      <p className="text-center text-inksoft/70 italic py-16">
        No stories added yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {stories.map((story) => (
          <div
            key={story.id}
            data-search-id={story.id}
            className="group glass-card rounded-2xl p-3 sm:p-4 card-shadow cursor-pointer border border-borderpink transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-200 flex flex-col"
            onClick={() => openStory(story)}
          >
            <div className="relative w-full aspect-[3/4] rounded-lg flex-shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-3xl overflow-hidden shadow-md mb-3">
              {story.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.cover_image_url}
                  alt={story.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                '📖'
              )}
              <span className="absolute top-2 left-2 text-[9px] font-semibold uppercase tracking-wide text-white bg-black/45 backdrop-blur-sm px-2 py-1 rounded-full">
                {story.category}
              </span>
              {story.video_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoStory(story);
                  }}
                  aria-label={`Play video for ${story.title}`}
                  title="Play video"
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/25 transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-white/90 text-pink-600 flex items-center justify-center text-lg shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                    ▶
                  </span>
                </button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-0.5 line-clamp-2 leading-snug">
                {story.title}
              </h4>
              {story.author && (
                <p className="text-[11px] text-inksoft/70 mb-1 truncate">by {story.author}</p>
              )}
              {story.description && (
                <p className="text-[11px] text-inksoft/60 line-clamp-2">{story.description}</p>
              )}
            </div>

            <div className="flex gap-1.5 mt-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  forceDownload(story.pdf_url, `${story.title}.pdf`);
                }}
                className="flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors truncate"
              >
                ↓ Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openStory(story);
                }}
                className="flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-sm truncate"
              >
                Read
              </button>
            </div>
          </div>
        ))}
      </div>

      <StoryReaderModal story={activeStory} onClose={() => setActiveStory(null)} />
      {videoStory && <StoryVideoModal story={videoStory} onClose={() => setVideoStory(null)} />}
    </>
  );
}
