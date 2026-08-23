import Header from '@/components/Header';
import AudioBookGrid from '@/components/AudioBookGrid';
import { supabase, AudioBookItem } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Audio Books — Maryam Naveed'
};

async function getAudioBooks(): Promise<AudioBookItem[]> {
  const { data } = await supabase
    .from('audio_books')
    .select('id, title, author, cover_image_url, audio_url, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function AudioBooksPage() {
  const books = await getAudioBooks();

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 via-goldlight/30 to-pink-50">
      <Header />

      <section className="relative overflow-hidden py-14 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-white/70 backdrop-blur px-4 py-1.5 rounded-full mb-3">
              Listen &amp; unwind
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">My Audio Books</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              Press play, sit back, and let the story carry you — every cover
              opens straight into its narration.
            </p>
          </div>

          <AudioBookGrid books={books} />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
