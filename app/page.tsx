import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import FocusCards from '@/components/FocusCards';
import HomeSections from '@/components/HomeSections';
import Reveal from '@/components/Reveal';
import { supabase, ArtItem, BookItem, BlogItem } from '@/lib/supabase';

export const revalidate = 0;

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

export default async function HomePage() {
  const [artItems, calligraphyItems, books, blogs] = await Promise.all([
    getArts('art'),
    getArts('calligraphy'),
    getBooks(),
    getBlogs()
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
      />

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink & canvas.
      </footer>
    </main>
  );
}
