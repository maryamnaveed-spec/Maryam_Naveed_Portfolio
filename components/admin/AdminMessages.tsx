'use client';

import { useEffect, useState } from 'react';
import { supabase, MessageItem } from '@/lib/supabase';

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    setLoading(true);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = messages.filter((m) => !m.is_read).length;

  async function markAsRead(id: string) {
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    await supabase.from('messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg">Messages</h3>
        {unreadCount > 0 && (
          <span className="text-[11px] font-semibold text-white bg-pink-600 px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-inksoft">Loading...</p>}
      {!loading && messages.length === 0 && (
        <p className="text-sm text-inksoft italic">No messages yet.</p>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`border rounded-lg p-4 ${
              msg.is_read ? 'border-borderpink' : 'border-pink-400 bg-pink-50/50'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <span className="font-semibold text-sm">{msg.name}</span>
                <span className="text-xs text-inksoft ml-2">{msg.email}</span>
              </div>
              {!msg.is_read && (
                <span className="text-[10px] font-semibold text-pink-600 uppercase flex-shrink-0">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-inksoft mb-3 whitespace-pre-wrap">{msg.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-inksoft/70">
                {new Date(msg.created_at).toLocaleString()}
              </span>
              <div className="flex gap-2">
                {!msg.is_read && (
                  <button
                    onClick={() => markAsRead(msg.id)}
                    className="text-[11px] font-semibold px-3 py-1 rounded-full border border-borderpink hover:bg-pink-50"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(msg.id)}
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
