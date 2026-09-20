import Header from '@/components/Header';
import StoriesPageView from '@/components/StoriesPageView';
import { supabase, StoryItem, STORY_CATEGORIES } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Written Stories — Maryam Naveed'
};

async function getStories(): Promise<StoryItem[]> {
  const { data } = await supabase
    .from('stories')
    .select('id, title, author, category, description, cover_image_url, pdf_url, video_url, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 text-center">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Fiction &amp; beyond
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">My Written Stories</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              Tales I&rsquo;ve written, ready to read cover to cover.
            </p>
          </div>

          <StoriesPageView stories={stories} categories={STORY_CATEGORIES} />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
