'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArtItem } from '@/lib/supabase';

export default function FeaturedCarousel({ items }: { items: ArtItem[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl glass-card">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image src={item.image_url} alt={item.title} fill className="object-cover" priority={i === 0} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-white/80 bg-white/15 backdrop-blur px-3 py-1 rounded-full">
              {item.category}
            </span>
            <h3 className="text-white text-2xl sm:text-3xl mt-3">{item.title}</h3>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30"
        aria-label="Previous"
      >
        ‹
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % items.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/30"
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}
