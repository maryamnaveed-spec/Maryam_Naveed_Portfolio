import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FocusCards from '@/components/FocusCards';
import HomeSections from '@/components/HomeSections';
import Reveal from '@/components/Reveal';
import { supabase, ArtItem, BookItem, StoryItem, BlogItem } from '@/lib/supabase';

// Always fetch fresh data server-side on every visit (no stale ISR/router
// cache) so newly-added art, books, stories, etc. show up immediately -
// this was previously "revalidate = 30", which could serve an empty/stale
// snapshot until a hard refresh.
export const dynamic = 'force-dynamic';

const FALLBACK_QUOTE =
  'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.';

async function getArts(category: 'art' | 'calligraphy'): Promise<ArtItem[]> {
  const { data } = await supabase
    .from('arts')
    .select('id, title, category, subcategory, description, image_url, before_after_gif_url, created_at')
    .eq('category', category)
    .order('created_at', { ascending: false });
  return data ?? [];
}

async function getBooks(): Promise<BookItem[]> {
  const { data } = await supabase
    .from('books')
    .select('id, title, author, language, cover_image_url, pdf_url, review, rating, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

async function getStories(): Promise<StoryItem[]> {
  const { data } = await supabase
    .from('stories')
    .select('id, title, author, category, description, cover_image_url, pdf_url, video_url, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

async function getBlogs(): Promise<BlogItem[]> {
  const { data } = await supabase
    .from('blogs')
    .select('id, title, content, category, cover_image_url, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

// One single request for all 3 settings fields instead of 3 separate
// round-trips to the same row — cuts homepage load latency further.
async function getSiteSettings(): Promise<{
  backgroundImage: string | null;
  quoteOfDay: string;
  profileImage: string | null;
}> {
  const { data, error } = await supabase
    .from('settings')
    .select('background_image_url, quote_of_day, profile_image_url')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch settings row:', error.message);
  }

  return {
    backgroundImage: data?.background_image_url ?? null,
    quoteOfDay: data?.quote_of_day || FALLBACK_QUOTE,
    profileImage: data?.profile_image_url ?? null
  };
}

export default async function HomePage() {
  const [artItems, calligraphyItems, books, stories, blogs, settings] = await Promise.all([
    getArts('art'),
    getArts('calligraphy'),
    getBooks(),
    getStories(),
    getBlogs(),
    getSiteSettings()
  ]);
  const { profileImage } = settings;

  return (
    <main>
      <Header />
      <Hero profileImage={profileImage} />

      <Reveal>
        <FocusCards />
      </Reveal>

      <HomeSections
        artItems={artItems}
        calligraphyItems={calligraphyItems}
        books={books}
        stories={stories}
        blogs={blogs}
      />

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink & canvas.
      </footer>
    </main>
  );
}
