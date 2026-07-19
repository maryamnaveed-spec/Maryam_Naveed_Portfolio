'use client';

import { useEffect, useState } from 'react';
import { supabase, BlogItem } from '@/lib/supabase';

export default function AdminManageBlogs() {
  const [items, setItems] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: BlogItem) {
    setEditingId(item.id);
    setEditForm({ title: item.title, content: item.content });
  }

  async function saveEdit(id: string) {
    await supabase
      .from('blogs')
      .update({ title: editForm.title, content: editForm.content })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this blog post permanently?')) return;
    await supabase.from('blogs').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <h3 className="text-lg mb-4">Manage blog posts</h3>
      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inksoft italic">No blog posts yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-borderpink rounded-lg p-3">
            {editingId === item.id ? (
              <div>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  rows={4}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <p className="text-xs text-inksoft truncate">{item.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink hover:bg-pink-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
