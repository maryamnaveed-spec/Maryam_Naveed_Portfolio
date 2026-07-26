'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArtItem } from '@/lib/supabase';
import ImageLightbox from './ImageLightbox';
import ShareButtons from './ShareButtons';

export default function ArtGrid({
  items,
  emptyLabel
}: {
  items: ArtItem[];
  emptyLabel: string;
}) {
  const [selected, setSelected] = useState<ArtItem | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-sm text-inksoft italic">
        {emptyLabel} — nothing uploaded yet. Check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="group glass-card rounded-card overflow-hidden card-shadow cursor-pointer border border-borderpink transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-400/50 hover:shadow-pink-400/15"
          >
            <div className="relative h-44 bg-pink-50 overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.before_after_gif_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.before_after_gif_url}
                  alt={`${item.title} before and after`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              )}
              <span className="absolute top-2 left-2 bg-white/90 text-pink-600 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                {item.category}
              </span>
              {item.before_after_gif_url && (
                <span className="absolute top-2 right-2 bg-gold text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
                  Before &amp; After
                </span>
              )}

              {/* Hover overlay with zoom icon */}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-11 h-11 rounded-full bg-white/0 group-hover:bg-white/95 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  🔍
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-base mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-inksoft">{item.description}</p>
              )}
              <ShareButtons title={item.title} imageUrl={item.image_url} />
            </div>
          </div>
        ))}
      </div>

      <ImageLightbox item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
