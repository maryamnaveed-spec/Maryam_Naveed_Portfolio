import Header from '@/components/Header';
import BlogSection from '@/components/BlogSection';
import { supabase, BlogItem } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog — Maryam Naveed'
};

async function getBlogs(): Promise<BlogItem[]> {
  const { data } = await supabase
    .from('blogs')
    .select('id, title, content, category, cover_image_url, created_at')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 text-center">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Thoughts &amp; writing
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">My Blog</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              Reflections on books, art, calligraphy and the mind.
            </p>
          </div>

          <BlogSection blogs={blogs} />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
