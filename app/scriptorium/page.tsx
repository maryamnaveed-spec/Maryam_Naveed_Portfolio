import Header from '@/components/Header';
import CategoryFilterGridPage from '@/components/CategoryFilterGridPage';
import { supabase, ArtItem, CALLIGRAPHY_SUBCATEGORIES } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'The Scriptorium — Maryam Naveed'
};

async function getCalligraphy(): Promise<ArtItem[]> {
  const { data } = await supabase
    .from('arts')
    .select('id, title, category, subcategory, description, image_url, before_after_gif_url, created_at')
    .eq('category', 'calligraphy')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function ScriptoriumPage() {
  const calligraphyItems = await getCalligraphy();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 text-center">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Ink &amp; script
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">The Scriptorium</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              Beauty carried in the flow of the pen.
            </p>
          </div>

          <CategoryFilterGridPage
            items={calligraphyItems}
            subcategories={CALLIGRAPHY_SUBCATEGORIES}
            emptyLabel="Scriptorium"
          />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
