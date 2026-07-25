import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FocusCards from '@/components/FocusCards';
import HomeSections from '@/components/HomeSections';
import Reveal from '@/components/Reveal';
import { supabase, ArtItem, BookItem, BlogItem } from '@/lib/supabase';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

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

async function getBackgroundImage(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('background_image_url')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch background_image_url from settings table:', error.message);
  }

  return data?.background_image_url ?? null;
}

async function getQuoteOfDay(): Promise<string> {
  const fallback =
    'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.';

  const { data, error } = await supabase
    .from('settings')
    .select('quote_of_day')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch quote_of_day from settings table:', error.message);
  }

  return data?.quote_of_day || fallback;
}

async function getProfileImage(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('profile_image_url')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Failed to fetch profile_image_url from settings table:', error.message);
  }

  return data?.profile_image_url ?? null;
}

export default async function HomePage() {
  const [artItems, calligraphyItems, books, blogs, backgroundImage, quoteOfDay, profileImage] = await Promise.all([
    getArts('art'),
    getArts('calligraphy'),
    getBooks(),
    getBlogs(),
    getBackgroundImage(),
    getQuoteOfDay(),
    getProfileImage()
  ]);

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
