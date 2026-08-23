'use client';

import { useMemo, useState } from 'react';
import { ArtItem, BookItem, BlogItem } from '@/lib/supabase';

type SearchResult = {
  key: string;
  rawId: string;
  type: 'Art' | 'Calligraphy' | 'Book' | 'Blog';
  icon: string;
  title: string;
  subtitle: string;
  image: string | null;
  sectionId: string;
};

const TYPE_STYLES: Record<SearchResult['type'], string> = {
  Art: 'text-pink-600 bg-pink-50',
  Calligraphy: 'text-violet-600 bg-violet-50',
  Book: 'text-amber-700 bg-amber-50',
  Blog: 'text-emerald-700 bg-emerald-50'
};

export default function SiteSearch({
  artItems,
  calligraphyItems,
  books,
  blogs,
  onNeedsArtFilterReset,
  onNeedsCalligraphyFilterReset
}: {
  artItems: ArtItem[];
  calligraphyItems: ArtItem[];
  books: BookItem[];
  blogs: BlogItem[];
  onNeedsArtFilterReset?: () => void;
  onNeedsCalligraphyFilterReset?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const allResults: SearchResult[] = useMemo(() => {
    const art: SearchResult[] = artItems.map((a) => ({
      key: `art-${a.id}`,
      rawId: a.id,
      type: 'Art',
      icon: '🎨',
      title: a.title,
      subtitle: [a.subcategory, a.description].filter(Boolean).join(' — '),
      image: a.image_url,
      sectionId: 'art'
    }));
    const calligraphy: SearchResult[] = calligraphyItems.map((a) => ({
      key: `cal-${a.id}`,
      rawId: a.id,
      type: 'Calligraphy',
      icon: '✒️',
      title: a.title,
      subtitle: [a.subcategory, a.description].filter(Boolean).join(' — '),
      image: a.image_url,
      sectionId: 'calligraphy'
    }));
    const bookResults: SearchResult[] = books.map((b) => ({
      key: `book-${b.id}`,
      rawId: b.id,
      type: 'Book',
      icon: '📚',
      title: b.title,
      subtitle: b.author || '',
      image: b.cover_image_url,
      sectionId: 'books'
    }));
    const blogResults: SearchResult[] = blogs.map((b) => ({
      key: `blog-${b.id}`,
      rawId: b.id,
      type: 'Blog',
      icon: '✍️',
      title: b.title,
      subtitle: b.content ? b.content.slice(0, 80) : '',
      image: b.cover_image_url,
      sectionId: 'blog'
    }));
    return [...art, ...calligraphy, ...bookResults, ...blogResults];
  }, [artItems, calligraphyItems, books, blogs]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allResults
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, allResults]);

  function scrollToElement(rawId: string, sectionId: string) {
    const el = document.querySelector(`[data-search-id="${rawId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('search-highlight-pulse');
      setTimeout(() => el.classList.remove('search-highlight-pulse'), 3600);
    } else {
      // Item exists but its card isn't in the DOM yet (e.g. filtered out) -
      // fall back to the section itself so the person still lands close by.
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goTo(result: SearchResult) {
    setQuery('');
    setFocused(false);

    // Art/Calligraphy grids can be filtered down to a subcategory - if the
    // matched item isn't in the currently visible subset, clear the filter
    // first so its card actually exists in the DOM to scroll to.
    if (result.type === 'Art') onNeedsArtFilterReset?.();
    if (result.type === 'Calligraphy') onNeedsCalligraphyFilterReset?.();

    // Give React a tick to re-render the unfiltered grid before measuring
    // and scrolling to the exact card.
    requestAnimationFrame(() => {
      setTimeout(() => scrollToElement(result.rawId, result.sectionId), 60);
    });
  }

  const showDropdown = focused && query.trim().length >= 2;

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="search-glow rounded-2xl">
        <div className="relative flex items-center bg-surface rounded-2xl border border-borderpink shadow-lg shadow-pink-400/5 focus-within:border-pink-400 focus-within:shadow-xl focus-within:shadow-pink-400/15 transition-all duration-300 px-5 py-4">
          <span className="text-xl mr-3 flex-shrink-0 text-pink-500" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search art, calligraphy, books, blog posts..."
            className="flex-1 bg-transparent outline-none text-sm sm:text-base placeholder:text-inksoft/45 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-inksoft/40 hover:text-pink-600 text-lg flex-shrink-0 ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-pink-50"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-surface border border-borderpink rounded-2xl shadow-2xl overflow-hidden z-30 animate-fadeUp">
          {results.length === 0 ? (
            <p className="text-sm text-inksoft/70 italic text-center py-8 px-4">
              No matches for &ldquo;{query}&rdquo; — try art, calligraphy, a book or blog title.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-borderpink/50">
              {results.map((r) => (
                <button
                  key={r.key}
                  onMouseDown={() => goTo(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-pink-50/70 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-pink-50 flex items-center justify-center text-lg ring-1 ring-borderpink">
                    {r.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      r.icon
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{r.title}</p>
                    {r.subtitle && (
                      <p className="text-[11px] text-inksoft/60 truncate">{r.subtitle}</p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0 ${TYPE_STYLES[r.type]}`}
                  >
                    {r.icon} {r.type}
                  </span>
                  <span className="text-inksoft/30 flex-shrink-0 text-sm" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-glow {
          animation: glowPulse 3.5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217, 78, 128, 0); }
          50% { box-shadow: 0 0 26px 5px rgba(217, 78, 128, 0.10); }
        }
        @media (prefers-reduced-motion: reduce) {
          .search-glow { animation: none; }
        }
      `}</style>
    </div>
  );
}
