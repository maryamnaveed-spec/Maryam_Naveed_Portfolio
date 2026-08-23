import Header from '@/components/Header';
import ProductsView from '@/components/ProductsView';
import { supabase, ProductCategoryItem, ProductItem } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop — Maryam Naveed'
};

async function getData(): Promise<{
  categories: ProductCategoryItem[];
  products: ProductItem[];
  errorMsg: string | null;
}> {
  const [catRes, prodRes] = await Promise.all([
    supabase.from('product_categories').select('id, name, created_at').order('created_at', { ascending: true }),
    supabase
      .from('products')
      .select('id, category_id, name, description, price, image_url, created_at')
      .order('created_at', { ascending: false })
  ]);

  const errorMsg = catRes.error?.message || prodRes.error?.message || null;

  return {
    categories: catRes.data ?? [],
    products: prodRes.data ?? [],
    errorMsg
  };
}

export default async function ProductsPage() {
  const { categories, products, errorMsg } = await getData();

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Shop
            </span>
            <h1 className="text-4xl sm:text-5xl mb-3">Products</h1>
            <p className="text-inksoft max-w-xl mx-auto">
              Original pieces and prints, ready to bring home.
            </p>
          </div>

          {errorMsg && (
            <div className="max-w-lg mx-auto mb-8 text-sm bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
              <p className="font-semibold mb-1">Couldn&rsquo;t load products</p>
              <p className="text-xs">{errorMsg}</p>
              <p className="text-xs mt-2 text-red-500">
                This is usually a Supabase permissions (RLS) issue — re-run the
                latest <code>supabase/schema.sql</code> in the Supabase SQL
                Editor to fix it.
              </p>
            </div>
          )}

          <ProductsView categories={categories} products={products} />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink &amp; canvas.
      </footer>
    </main>
  );
}
