'use client';

import { ArtItem, BookItem, BlogItem, StoryItem } from '@/lib/supabase';
import FeaturedCarousel from './FeaturedCarousel';
import AnimatedCounters from './AnimatedCounters';
import SiteSearch from './SiteSearch';
import Reveal from './Reveal';

export default function HomeSections({
  artItems,
  calligraphyItems,
  books,
  stories,
  blogs
}: {
  artItems: ArtItem[];
  calligraphyItems: ArtItem[];
  books: BookItem[];
  stories: StoryItem[];
  blogs: BlogItem[];
}) {
  const featured = [...artItems, ...calligraphyItems].slice(0, 6);

  const artworkCount = artItems.length + calligraphyItems.length;
  const bookCount = books.length;
  const averageRating =
    books.length > 0 ? books.reduce((sum, b) => sum + b.rating, 0) / books.length : 0;

  return (
    <>
      {featured.length > 0 && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal>
              <FeaturedCarousel items={featured} />
            </Reveal>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <AnimatedCounters
              artworkCount={artworkCount}
              bookCount={bookCount}
              averageRating={averageRating}
            />
          </Reveal>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="text-center mb-6 sm:mb-8">
              <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
                Find something beautiful
              </span>
              <h2 className="text-2xl sm:text-3xl">What are you looking for?</h2>
            </div>
            <SiteSearch
              artItems={artItems}
              calligraphyItems={calligraphyItems}
              books={books}
              stories={stories}
              blogs={blogs}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
