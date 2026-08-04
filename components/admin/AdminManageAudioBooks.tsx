'use client';

import { useEffect, useState } from 'react';
import { supabase, AudioBookItem } from '@/lib/supabase';

export default function AdminManageAudioBooks() {
  const [items, setItems] = useState<AudioBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', author: '' });

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('audio_books')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: AudioBookItem) {
    setEditingId(item.id);
    setEditForm({ title: item.title, author: item.author ?? '' });
  }

  async function saveEdit(id: string) {
    await supabase
      .from('audio_books')
      .update({ title: editForm.title, author: editForm.author || null })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this audiobook permanently?')) return;
    await supabase.from('audio_books').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <h3 className="text-lg mb-4">Manage audiobooks</h3>
      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inksoft italic">No audiobooks uploaded yet.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  placeholder="Author"
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
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink text-inksoft"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-pink-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover_image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  {item.author && (
                    <p className="text-xs text-inksoft/70 truncate">by {item.author}</p>
                  )}
                  <div className="flex gap-2 mt-1.5">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
