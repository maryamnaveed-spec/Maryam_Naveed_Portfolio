import Header from '@/components/Header';
import LibraryPageView from '@/components/LibraryPageView';
import { supabase, BookItem, AudioBookItem } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'The Library — Maryam Naveed'
};

async function getData(): Promise<{ books: BookItem[]; audioBooks: AudioBookItem[] }> {
  const [{ data: books }, { data: audioBooks }] = await Promise.all([
    supabase
      .from('books')
      .select('id, title, author, language, cover_image_url, pdf_url, review, rating, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('audio_books')
      .select('id, title, author, cover_image_url, audio_url, created_at')
      .order('created_at', { ascending: false })
  ]);
  return { books: books ?? [], audioBooks: audioBooks ?? [] };
}

export default async function LibraryPage() {
  const { books, audioBooks } = await getData();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 text-center">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Stories &amp; books
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">The Library</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              A quiet shelf of stories — read them right here, or listen along.
            </p>
          </div>

          <LibraryPageView books={books} audioBooks={audioBooks} />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
