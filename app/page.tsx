import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FocusCards from '@/components/FocusCards';
import HomeSections from '@/components/HomeSections';
import Reveal from '@/components/Reveal';
import { supabase, ArtItem, BookItem, BlogItem } from '@/lib/supabase';

// Serve the homepage instantly from cache and refresh it quietly every
// 30 seconds in the background, instead of blocking every single visit on
// a fresh round-trip to Supabase (that's what was making navigation feel slow).
export const revalidate = 30;

const FALLBACK_QUOTE =
  'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.';

async function getArts(category: 'art' | 'calligraphy'): Promise<ArtItem[]> {
  const { data } = await supabase
    .from('arts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  return data ?? [];
}

async function getBooks(): Promise<BookItem[]> {
  const { data } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

async function getBlogs(): Promise<BlogItem[]> {
  const { data } = await supabase
    .from('blogs')
    .select('*')
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
  const [artItems, calligraphyItems, books, blogs, settings] = await Promise.all([
    getArts('art'),
    getArts('calligraphy'),
    getBooks(),
    getBlogs(),
    getSiteSettings()
  ]);
  const { backgroundImage, quoteOfDay, profileImage } = settings;

  return (
    <main>
      <Header />
      <Hero backgroundImage={backgroundImage} />

      <AboutSection profileImage={profileImage} />

      <Reveal>
        <FocusCards />
      </Reveal>

      <HomeSections
        artItems={artItems}
        calligraphyItems={calligraphyItems}
        books={books}
        blogs={blogs}
        quoteOfDay={quoteOfDay}
      />

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink & canvas.
      </footer>
    </main>
  );
}
