'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioBookItem } from '@/lib/supabase';

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AudioBookCard({ book }: { book: AudioBookItem }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrent(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      // Only one book plays at a time - pause every other <audio> on the page first.
      document.querySelectorAll('audio').forEach((el) => {
        if (el !== audio) el.pause();
      });
      audio.play();
      setPlaying(true);
    }
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || Infinity);
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrent(value);
  }

  return (
    <div className="audiobook-float bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl p-4 sm:p-5 shadow-xl transition-transform duration-300 hover:-translate-y-1.5">
      <audio ref={audioRef} src={book.audio_url} preload="metadata" onPause={() => setPlaying(false)} />

      <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.cover_image_url}
          alt={book.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {playing && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-semibold text-white bg-pink-600/90 px-2 py-1 rounded-full">
            <span className="eq-bar" /> <span className="eq-bar" /> <span className="eq-bar" />
            Playing
          </span>
        )}
      </div>

      <h4 className="text-sm sm:text-base font-semibold mb-0.5 line-clamp-2 text-ink">{book.title}</h4>
      {book.author && <p className="text-xs text-inksoft/70 mb-3 truncate">by {book.author}</p>}

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        onChange={seek}
        className="w-full accent-pink-500 h-1 mb-1.5 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-inksoft/60 mb-3">
        <span>{formatTime(current)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={() => skip(-10)}
          aria-label="Back 10 seconds"
          title="Back 10s"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors text-sm"
        >
          ⏪
        </button>
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-400/30 hover:shadow-pink-400/50 transition-shadow text-lg"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          onClick={() => skip(10)}
          aria-label="Forward 10 seconds"
          title="Forward 10s"
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors text-sm"
        >
          ⏩
        </button>
      </div>

      <style jsx>{`
        .audiobook-float {
          animation: floatCard 5s ease-in-out infinite;
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .eq-bar {
          display: inline-block;
          width: 2px;
          height: 8px;
          background: white;
          animation: eq 0.8s ease-in-out infinite;
        }
        .eq-bar:nth-child(2) { animation-delay: 0.15s; }
        .eq-bar:nth-child(3) { animation-delay: 0.3s; }
        @keyframes eq {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .audiobook-float { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function AudioBookGrid({ books }: { books: AudioBookItem[] }) {
  if (books.length === 0) {
    return (
      <p className="text-center text-inksoft/70 italic py-16">
        No audiobooks uploaded yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {books.map((book) => (
        <AudioBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
