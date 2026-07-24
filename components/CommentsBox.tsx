'use client';

import { useEffect, useState } from 'react';
import { supabase, CommentItem } from '@/lib/supabase';

export default function CommentsBox({
  itemType,
  itemId,
  itemTitle
}: {
  itemType: 'art' | 'book';
  itemId: string;
  itemTitle: string;
}) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: settingsData }, { data: commentsData }] = await Promise.all([
        supabase.from('settings').select('comments_enabled').eq('id', 1).single(),
        supabase
          .from('comments')
          .select('*')
          .eq('item_type', itemType)
          .eq('item_id', itemId)
          .order('created_at', { ascending: false })
      ]);
      setEnabled(settingsData?.comments_enabled ?? true);
      setComments(commentsData ?? []);
      setLoading(false);
    }
    load();
  }, [itemType, itemId]);

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setPosting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({ item_type: itemType, item_id: itemId, item_title: itemTitle, name, comment: text, is_read: false })
      .select()
      .single();

    setPosting(false);
    if (!error && data) {
      setComments((prev) => [data, ...prev]);
      setName('');
      setText('');
    }
  }

  if (loading) return null;
  if (!enabled) return null;

  return (
    <div className="mt-6 pt-5 border-t border-borderpink">
      <h5 className="text-sm font-semibold mb-3">
        Reader views {comments.length > 0 && `(${comments.length})`}
      </h5>

      <form onSubmit={submitComment} className="mb-4 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full border border-borderpink rounded-lg px-3 py-1.5 text-sm"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your view..."
          required
          rows={2}
          className="w-full border border-borderpink rounded-lg px-3 py-1.5 text-sm"
        />
        <button
          disabled={posting}
          className="text-xs font-semibold px-4 py-1.5 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
        >
          {posting ? 'Posting...' : 'Post view'}
        </button>
      </form>

      {comments.length > 0 && (
        <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-semibold">{c.name}</span>
              <span className="text-inksoft/60 text-xs ml-2">
                {new Date(c.created_at).toLocaleDateString('en-US')}
              </span>
              <p className="text-inksoft">{c.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
