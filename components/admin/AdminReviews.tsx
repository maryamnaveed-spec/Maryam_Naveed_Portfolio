'use client';

import { useEffect, useState } from 'react';
import { supabase, CommentItem } from '@/lib/supabase';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markAsRead(id: string) {
    await supabase.from('comments').update({ is_read: true }).eq('id', id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_read: true } : r)));
  }

  async function deleteReview(id: string) {
    if (!confirm('Delete this review?')) return;
    await supabase.from('comments').delete().eq('id', id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const unreadCount = reviews.filter((r) => !r.is_read).length;

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg">Reader reviews</h3>
        {unreadCount > 0 && (
          <span className="text-[11px] font-semibold text-white bg-pink-600 px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && reviews.length === 0 && (
        <p className="text-sm text-inksoft italic">No reviews yet.</p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={`border rounded-lg p-4 ${
              r.is_read ? 'border-borderpink' : 'border-pink-400 bg-pink-50/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-xs text-inksoft ml-2">
                  on {r.item_type === 'art' ? 'artwork' : 'book'}: {r.item_title || 'Untitled'}
                </span>
              </div>
              {!r.is_read && (
                <span className="text-[10px] font-semibold text-pink-600 uppercase flex-shrink-0">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-inksoft mb-3">{r.comment}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-inksoft/70">
                {new Date(r.created_at).toLocaleString('en-US')}
              </span>
              <div className="flex gap-2">
                {!r.is_read && (
                  <button
                    onClick={() => markAsRead(r.id)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink hover:bg-pink-50"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteReview(r.id)}
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
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
