'use client';

import Link from 'next/link';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');

  return (
    <AdminAuthGuard>
      <main className="min-h-screen bg-bg">
        <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 via-gold to-pink-600" />
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-lg shadow-md flex-shrink-0">
                🛍️
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl leading-tight">Shop management</h1>
                <p className="text-xs text-inksoft">Add products, organize categories &amp; track orders</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="text-xs font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 hover:border-pink-300 transition-colors"
            >
              ← Back to dashboard
            </Link>
          </div>

          <div className="flex gap-1.5 bg-pink-50 p-1.5 rounded-full w-fit mb-8">
            {(['products', 'orders'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-full capitalize transition-all duration-300 ${
                  tab === t ? 'bg-white shadow-md text-pink-600 scale-[1.03]' : 'text-inksoft hover:bg-white/60'
                }`}
              >
                {t === 'products' ? '🛍️' : '🧾'} {t}
              </button>
            ))}
          </div>

          <div key={tab} className="animate-fadeUp">
            {tab === 'products' && <AdminProducts />}
            {tab === 'orders' && <AdminOrders />}
          </div>
        </div>
      </main>
    </AdminAuthGuard>
  );
}
