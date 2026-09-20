'use client';

import { useEffect, useState } from 'react';
import { supabase, StoryItem, STORY_CATEGORIES } from '@/lib/supabase';

export default function AdminManageStories() {
  const [items, setItems] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    category: STORY_CATEGORIES[0],
    description: ''
  });

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: StoryItem) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      author: item.author ?? '',
      category: item.category,
      description: item.description ?? ''
    });
  }

  async function saveEdit(id: string) {
    await supabase
      .from('stories')
      .update({
        title: editForm.title,
        author: editForm.author || null,
        category: editForm.category,
        description: editForm.description || null
      })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this story permanently?')) return;
    await supabase.from('stories').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <h3 className="text-lg mb-4">Manage written stories</h3>
      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inksoft italic">No stories uploaded yet.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-borderpink rounded-lg p-3">
            {editingId === item.id ? (
              <div>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <input
                  value={editForm.author}
                  onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                  placeholder="Author (optional)"
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                >
                  {STORY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Short description"
                  rows={2}
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
                  {item.author && <p className="text-xs text-inksoft truncate">by {item.author}</p>}
                  <span className="inline-block text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full mt-1">
                    {item.category}
                  </span>
                  {item.video_url && (
                    <span className="inline-block text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full mt-1 ml-1.5">
                      🎥 has video
                    </span>
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
