'use client';

import { ArtItem, BookItem, BlogItem } from '@/lib/supabase';
import CategoryFilterGrid from './CategoryFilterGrid';
import LibrarySection from './LibrarySection';
import BlogSection from './BlogSection';
import FeaturedCarousel from './FeaturedCarousel';
import Reveal from './Reveal';
import { useFilters } from './FiltersProvider';
import { ART_SUBCATEGORIES, CALLIGRAPHY_SUBCATEGORIES } from '@/lib/supabase';

export default function HomeSections({
  artItems,
  calligraphyItems,
  books,
  blogs
}: {
  artItems: ArtItem[];
  calligraphyItems: ArtItem[];
  books: BookItem[];
  blogs: BlogItem[];
}) {
  const { artFilter, setArtFilter, calligraphyFilter, setCalligraphyFilter } = useFilters();
  const featured = [...artItems, ...calligraphyItems].slice(0, 6);

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

      <section id="art" className="py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-6">
              <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
                Visual interpretations
              </div>
              <h2 className="text-3xl">My Art</h2>
              <p className="text-sm text-inksoft mt-1.5 max-w-md">
                Where imagination meets structured design. Every stroke is drawn
                with feeling.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <CategoryFilterGrid
              items={artItems}
              subcategories={ART_SUBCATEGORIES}
              activeFilter={artFilter}
              onFilterChange={setArtFilter}
              emptyLabel="Art gallery"
            />
          </Reveal>
        </div>
      </section>

      <section id="calligraphy" className="py-14 bg-pink-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-6">
              <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
                Ink & script
              </div>
              <h2 className="text-3xl">My Calligraphy</h2>
              <p className="text-sm text-inksoft mt-1.5 max-w-md">
                Beauty carried in the flow of the pen.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <CategoryFilterGrid
              items={calligraphyItems}
              subcategories={CALLIGRAPHY_SUBCATEGORIES}
              activeFilter={calligraphyFilter}
              onFilterChange={setCalligraphyFilter}
              emptyLabel="Calligraphy"
            />
          </Reveal>
        </div>
      </section>

      <section id="books" className="py-14">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-6">
              <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
                Library & books
              </div>
              <h2 className="text-3xl">My Library</h2>
              <p className="text-sm text-inksoft mt-1.5 max-w-md">
                Reviews, ratings, and a PDF for every book — download it or read
                it right here.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <LibrarySection books={books} />
          </Reveal>
        </div>
      </section>

      <section id="blog" className="py-14 bg-pink-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="mb-6">
              <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
                Thoughts & writing
              </div>
              <h2 className="text-3xl">My Blog</h2>
              <p className="text-sm text-inksoft mt-1.5 max-w-md">
                Reflections on books, art, calligraphy and the mind.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <BlogSection blogs={blogs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
