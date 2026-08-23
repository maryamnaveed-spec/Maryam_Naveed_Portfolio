'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Stat = {
  label: string;
  value: number;
  icon: string;
  tone: string;
};

export default function AdminStatsOverview({ onJump }: { onJump: (tab: string) => void }) {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = await Promise.all([
        supabase.from('arts').select('*', { count: 'exact', head: true }).eq('category', 'art'),
        supabase.from('arts').select('*', { count: 'exact', head: true }).eq('category', 'calligraphy'),
        supabase.from('books').select('*', { count: 'exact', head: true }),
        supabase.from('audio_books').select('*', { count: 'exact', head: true }),
        supabase.from('blogs').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      setStats({
        art: results[0].count ?? 0,
        calligraphy: results[1].count ?? 0,
        books: results[2].count ?? 0,
        audiobooks: results[3].count ?? 0,
        blogs: results[4].count ?? 0,
        products: results[5].count ?? 0,
        pendingOrders: results[6].count ?? 0,
        unreadMessages: results[7].count ?? 0
      });
      setLoading(false);
    }
    load();
  }, []);

  const items: (Stat & { tab: string })[] = [
    { label: 'Art pieces', value: stats.art ?? 0, icon: '🎨', tone: 'text-pink-600', tab: 'manage' },
    { label: 'Calligraphy', value: stats.calligraphy ?? 0, icon: '✒️', tone: 'text-violet-600', tab: 'manage' },
    { label: 'Books', value: stats.books ?? 0, icon: '📚', tone: 'text-amber-700', tab: 'manage' },
    { label: 'Audiobooks', value: stats.audiobooks ?? 0, icon: '🎧', tone: 'text-sky-600', tab: 'manage' },
    { label: 'Blog posts', value: stats.blogs ?? 0, icon: '✍️', tone: 'text-emerald-700', tab: 'manage' },
    { label: 'Products', value: stats.products ?? 0, icon: '🛍️', tone: 'text-pink-600', tab: 'products-page' },
    {
      label: 'Pending orders',
      value: stats.pendingOrders ?? 0,
      icon: '🧾',
      tone: stats.pendingOrders ? 'text-red-500' : 'text-inksoft/60',
      tab: 'products-page'
    },
    {
      label: 'Unread messages',
      value: stats.unreadMessages ?? 0,
      icon: '💬',
      tone: stats.unreadMessages ? 'text-red-500' : 'text-inksoft/60',
      tab: 'messages'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {items.map((s) => (
        <button
          key={s.label}
          onClick={() => (s.tab === 'products-page' ? onJump('products-page') : onJump(s.tab))}
          className="text-left bg-surface border border-borderpink rounded-2xl p-4 card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-pink-200"
        >
          <span className="text-xl" aria-hidden="true">
            {s.icon}
          </span>
          <p className={`text-2xl font-semibold mt-1 ${s.tone}`}>{loading ? '—' : s.value}</p>
          <p className="text-[11px] text-inksoft/70 mt-0.5">{s.label}</p>
        </button>
      ))}
    </div>
  );
}
