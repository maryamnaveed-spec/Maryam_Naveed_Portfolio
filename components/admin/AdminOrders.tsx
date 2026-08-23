'use client';

import { useEffect, useState } from 'react';
import { supabase, OrderItem } from '@/lib/supabase';
import { formatPKR } from '@/lib/currency';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data ?? []) as OrderItem[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: 'confirmed' | 'cancelled') {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function remove(id: string) {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg">Orders</h3>
        {pendingCount > 0 && (
          <span className="text-[11px] font-semibold text-white bg-pink-600 px-2 py-0.5 rounded-full">
            {pendingCount} pending
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-sm text-inksoft italic">No orders yet.</p>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className={`border rounded-lg p-4 ${
              o.status === 'pending'
                ? 'border-pink-400 bg-pink-50/50'
                : o.status === 'confirmed'
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-borderpink opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <span className="font-semibold text-sm">{o.customer_name}</span>
                <span className="text-xs text-inksoft/70 ml-2">{o.phone}</span>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                  o.status === 'pending'
                    ? 'text-pink-600 bg-pink-100'
                    : o.status === 'confirmed'
                    ? 'text-emerald-700 bg-emerald-100'
                    : 'text-inksoft bg-borderpink'
                }`}
              >
                {o.status}
              </span>
            </div>
            {o.address && <p className="text-xs text-inksoft/70 mb-2">{o.address}</p>}

            <div className="text-xs bg-white/60 rounded-lg p-2 mb-2">
              {o.items.map((it, idx) => (
                <div key={idx} className="flex justify-between py-0.5">
                  <span>
                    {it.name} ×{it.qty}
                  </span>
                  <span>
                    {formatPKR(it.price * it.qty)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-1 mt-1 border-t border-borderpink">
                <span>Total</span>
                <span>
                  {formatPKR(o.total)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-inksoft/70">
                {new Date(o.created_at).toLocaleString('en-US')}
              </span>
              <div className="flex gap-2">
                {o.status !== 'confirmed' && (
                  <button
                    onClick={() => setStatus(o.id, 'confirmed')}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Confirm
                  </button>
                )}
                {o.status !== 'cancelled' && (
                  <button
                    onClick={() => setStatus(o.id, 'cancelled')}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => remove(o.id)}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
