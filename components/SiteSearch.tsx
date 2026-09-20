'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArtItem, BookItem, BlogItem, StoryItem } from '@/lib/supabase';

type SearchResult = {
  key: string;
  rawId: string;
  type: 'Art' | 'Calligraphy' | 'Book' | 'Story' | 'Blog';
  icon: string;
  title: string;
  subtitle: string;
  image: string | null;
  pageUrl: string;
};

const TYPE_STYLES: Record<SearchResult['type'], string> = {
  Art: 'text-pink-600 bg-pink-50',
  Calligraphy: 'text-violet-600 bg-violet-50',
  Book: 'text-amber-700 bg-amber-50',
  Story: 'text-fuchsia-700 bg-fuchsia-50',
  Blog: 'text-emerald-700 bg-emerald-50'
};

export default function SiteSearch({
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
  const router = useRouter();
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
      pageUrl: '/gallery'
    }));
    const calligraphy: SearchResult[] = calligraphyItems.map((a) => ({
      key: `cal-${a.id}`,
      rawId: a.id,
      type: 'Calligraphy',
      icon: '✒️',
      title: a.title,
      subtitle: [a.subcategory, a.description].filter(Boolean).join(' — '),
      image: a.image_url,
      pageUrl: '/scriptorium'
    }));
    const bookResults: SearchResult[] = books.map((b) => ({
      key: `book-${b.id}`,
      rawId: b.id,
      type: 'Book',
      icon: '📚',
      title: b.title,
      subtitle: b.author || '',
      image: b.cover_image_url,
      pageUrl: '/library'
    }));
    const storyResults: SearchResult[] = stories.map((s) => ({
      key: `story-${s.id}`,
      rawId: s.id,
      type: 'Story',
      icon: '📖',
      title: s.title,
      subtitle: [s.category, s.author ? `by ${s.author}` : ''].filter(Boolean).join(' — '),
      image: s.cover_image_url,
      pageUrl: '/stories'
    }));
    const blogResults: SearchResult[] = blogs.map((b) => ({
      key: `blog-${b.id}`,
      rawId: b.id,
      type: 'Blog',
      icon: '✍️',
      title: b.title,
      subtitle: b.content ? b.content.slice(0, 80) : '',
      image: b.cover_image_url,
      pageUrl: '/blog'
    }));
    return [...art, ...calligraphy, ...bookResults, ...storyResults, ...blogResults];
  }, [artItems, calligraphyItems, books, stories, blogs]);

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

  function goTo(result: SearchResult) {
    setQuery('');
    setFocused(false);
    // Every content type now lives on its own dedicated page.
    router.push(result.pageUrl);
  }

  const showDropdown = focused && query.trim().length >= 2;

  return (
    <div className="relative max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto">
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
            placeholder="Search art, calligraphy, books, stories, blog posts..."
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
