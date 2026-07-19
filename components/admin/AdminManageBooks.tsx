'use client';

import { useEffect, useState } from 'react';
import { supabase, BookItem } from '@/lib/supabase';

export default function AdminManageBooks() {
  const [items, setItems] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    review: '',
    rating: 5,
    language: 'English' as 'English' | 'Urdu'
  });

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(item: BookItem) {
    setEditingId(item.id);
    setEditForm({
      title: item.title,
      author: item.author ?? '',
      review: item.review ?? '',
      rating: item.rating,
      language: item.language
    });
  }

  async function saveEdit(id: string) {
    await supabase
      .from('books')
      .update({
        title: editForm.title,
        author: editForm.author,
        review: editForm.review,
        rating: editForm.rating,
        language: editForm.language
      })
      .eq('id', id);
    setEditingId(null);
    load();
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this book permanently?')) return;
    await supabase.from('books').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <h3 className="text-lg mb-4">Manage books</h3>
      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && items.length === 0 && (
        <p className="text-sm text-inksoft italic">No books uploaded yet.</p>
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
                  placeholder="Author"
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <textarea
                  value={editForm.review}
                  onChange={(e) => setEditForm({ ...editForm, review: e.target.value })}
                  placeholder="Review"
                  rows={2}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                />
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} star{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={editForm.language}
                  onChange={(e) => setEditForm({ ...editForm, language: e.target.value as 'English' | 'Urdu' })}
                  className="w-full border border-borderpink rounded px-2 py-1 text-sm mb-2"
                >
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
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
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  {item.author && <p className="text-xs text-inksoft">{item.author}</p>}
                  <span className="text-[10px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                    {item.language}
                  </span>
                  <p className="text-xs text-gold mt-1">{'★'.repeat(item.rating)}</p>
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
