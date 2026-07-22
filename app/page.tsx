import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FocusCards from '@/components/FocusCards';
import HomeSections from '@/components/HomeSections';
import Reveal from '@/components/Reveal';
import { supabase, ArtItem, BookItem, BlogItem } from '@/lib/supabase';

export const revalidate = 30;

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

async function getQuoteOfDay(): Promise<string> {
  const { data } = await supabase
    .from('settings')
    .select('quote_of_day')
    .eq('id', 1)
    .single();
  return (
    data?.quote_of_day ??
    'Every book tells a story. Every artwork expresses an emotion. Every mind holds a unique perspective.'
  );
}

export default async function HomePage() {
  const [artItems, calligraphyItems, books, blogs, quoteOfDay] = await Promise.all([
    getArts('art'),
    getArts('calligraphy'),
    getBooks(),
    getBlogs(),
    getQuoteOfDay()
  ]);

  return (
    <main>
      <Header />
      <Hero />

      <Reveal>
        <AboutSection />
      </Reveal>

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
