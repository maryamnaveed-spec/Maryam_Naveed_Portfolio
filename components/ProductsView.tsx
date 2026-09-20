'use client';

import { useState } from 'react';
import { ProductCategoryItem, ProductItem } from '@/lib/supabase';
import { formatPKR } from '@/lib/currency';
import { useCart } from './CartProvider';
import CheckoutModal from './CheckoutModal';

function ProductCard({ product }: { product: ProductItem }) {
  const { lines, addToCart, setQty } = useCart();
  const line = lines.find((l) => l.id === product.id);

  return (
    <div className="group bg-surface border border-borderpink rounded-2xl overflow-hidden card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-pink-200 flex flex-col">
      <div className="relative w-full aspect-square overflow-hidden bg-pink-50">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="text-sm font-semibold mb-1 line-clamp-1">{product.name}</h4>
        {product.description && (
          <p className="text-xs text-inksoft/70 mb-2 line-clamp-2 flex-1">{product.description}</p>
        )}
        <p className="text-base font-semibold text-pink-600 mb-3">
          {formatPKR(product.price)}
        </p>

        {line ? (
          <div className="flex items-center justify-between border border-borderpink rounded-full px-2 py-1.5">
            <button
              onClick={() => setQty(product.id, line.qty - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-pink-50 text-pink-600 font-bold"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-sm font-semibold">{line.qty}</span>
            <button
              onClick={() => setQty(product.id, line.qty + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-pink-50 text-pink-600 font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="w-full text-xs font-semibold py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-sm"
          >
            🛒 Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductsView({
  categories,
  products
}: {
  categories: ProductCategoryItem[];
  products: ProductItem[];
}) {
  const { lines, totalCount, totalPrice, setQty, removeFromCart } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const grouped = categories
    .map((cat) => ({ cat, items: products.filter((p) => p.category_id === cat.id) }))
    .filter((g) => g.items.length > 0);

  // Anything without a category_id, OR whose category_id doesn't match any
  // category we actually got back (e.g. the category was deleted, or its
  // row just isn't visible for some reason) - falls back here instead of
  // silently disappearing from the page.
  const knownCategoryIds = new Set(categories.map((c) => c.id));
  const uncategorized = products.filter(
    (p) => !p.category_id || !knownCategoryIds.has(p.category_id)
  );

  if (products.length === 0) {
    return (
      <p className="text-center text-inksoft/70 italic py-16">
        No products added yet — check back soon.
      </p>
    );
  }

  return (
    <div className="pb-28">
      {grouped.map(({ cat, items }) => (
        <div key={cat.id} className="mb-12">
          <h2 className="text-2xl mb-5">{cat.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl mb-5">Other</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {uncategorized.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Floating cart summary bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-borderpink shadow-2xl animate-fadeUp">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => setCartOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-semibold text-inksoft flex-1 min-w-0"
            >
              <span className="relative flex-shrink-0">
                🛒
                <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white bg-pink-600 rounded-full">
                  {totalCount}
                </span>
              </span>
              <span className="truncate">
                {formatPKR(totalPrice)}
              </span>
              <span className="text-inksoft/50 text-xs">{cartOpen ? '▾ hide' : '▴ view cart'}</span>
            </button>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="flex-shrink-0 text-sm font-semibold px-5 py-2.5 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-md"
            >
              Checkout
            </button>
          </div>

          {cartOpen && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-4 max-h-52 overflow-y-auto border-t border-borderpink/60 pt-3">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-pink-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs flex-1 truncate">{l.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setQty(l.id, l.qty - 1)}
                      className="w-6 h-6 rounded-full border border-borderpink text-xs"
                    >
                      −
                    </button>
                    <span className="text-xs w-4 text-center">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.id, l.qty + 1)}
                      className="w-6 h-6 rounded-full border border-borderpink text-xs"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(l.id)}
                    className="text-[10px] text-red-500 flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
