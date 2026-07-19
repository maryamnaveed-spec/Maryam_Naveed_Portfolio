'use client';

import { useEffect, useState } from 'react';
import { supabase, ArtItem, ART_SUBCATEGORIES, CALLIGRAPHY_SUBCATEGORIES } from '@/lib/supabase';

export default function AdminManageArts({
  category,
  title
}: {
  category: 'art' | 'calligraphy';
  title: string;
}) {
  const [items, setItems] = useState<ArtItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', subcategory: '' });
  const subcategoryOptions = category === 'art' ? ART_SUBCATEGORIES : CALLIGRAPHY_SUBCATEGORIES;

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('arts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [category]);

  function startEdit(item: ArtItem) {
    setEditingId(item.id);
    setEditForm({ title: item.title, description: item.description ?? '', subcategory: item.subcategory });
  }

  async function saveEdit(id: string) {
    await supabase
      .from('arts')
      .update({ title: editForm.title, description: editForm.description, subcategory: editForm.subcategory })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this item permanently?')) return;
    await supabase.from('arts').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <h3 className="text-lg mb-4">{title}</h3>
      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inksoft italic">Nothing uploaded yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-borderpink rounded-lg p-3 flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_url}
              alt={item.title}
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />

            {editingId === item.id ? (
              <div className="flex-1">
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                  rows={2}
                />
                <select
                  value={editForm.subcategory}
                  onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                >
                  {subcategoryOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                    {item.subcategory}
                  </span>
                  {item.description && (
                    <p className="text-xs text-inksoft mt-1">{item.description}</p>
                  )}
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
