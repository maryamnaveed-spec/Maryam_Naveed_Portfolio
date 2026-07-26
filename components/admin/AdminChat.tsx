'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase, ChatMessageItem } from '@/lib/supabase';

type Thread = {
  visitorId: string;
  name: string;
  messages: ChatMessageItem[];
  unread: number;
  lastAt: string;
};

export default function AdminChat() {
  const [all, setAll] = useState<ChatMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });
    setAll(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const threads: Thread[] = useMemo(() => {
    const byVisitor = new Map<string, ChatMessageItem[]>();
    for (const m of all) {
      const arr = byVisitor.get(m.visitor_id) ?? [];
      arr.push(m);
      byVisitor.set(m.visitor_id, arr);
    }
    const list: Thread[] = [];
    byVisitor.forEach((messages, visitorId) => {
      const name = [...messages].reverse().find((m) => m.sender === 'user')?.name ?? 'Visitor';
      const unread = messages.filter((m) => m.sender === 'user' && !m.is_read).length;
      const lastAt = messages[messages.length - 1]?.created_at ?? '';
      list.push({ visitorId, name, messages, unread, lastAt });
    });
    return list.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  }, [all]);

  const active = threads.find((t) => t.visitorId === activeId) ?? threads[0] ?? null;

  useEffect(() => {
    if (!activeId && threads.length > 0) setActiveId(threads[0].visitorId);
  }, [threads, activeId]);

  useEffect(() => {
    if (!active) return;
    const unreadIds = active.messages.filter((m) => m.sender === 'user' && !m.is_read).map((m) => m.id);
    if (unreadIds.length > 0) {
      supabase.from('chat_messages').update({ is_read: true }).in('id', unreadIds).then(() => load());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.visitorId]);

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim() || !active) return;
    setSending(true);
    await supabase.from('chat_messages').insert({
      visitor_id: active.visitorId,
      name: 'Maryam',
      sender: 'admin',
      message: reply.trim()
    });
    setReply('');
    await load();
    setSending(false);
  }

  async function deleteConversation(visitorId: string) {
    if (!confirm('Delete this whole conversation? It will disappear for the visitor too.')) return;
    await supabase.from('chat_messages').delete().eq('visitor_id', visitorId);
    setAll((prev) => prev.filter((m) => m.visitor_id !== visitorId));
    if (activeId === visitorId) setActiveId(null);
  }

  const totalUnread = threads.reduce((sum, t) => sum + t.unread, 0);

  return (
    <div className="bg-surface border border-borderpink rounded-card card-shadow overflow-hidden">
      <div className="flex items-center gap-2 px-6 pt-6 pb-4">
        <h3 className="text-lg">Live chat</h3>
        {totalUnread > 0 && (
          <span className="text-[11px] font-semibold text-white bg-pink-600 px-2 py-0.5 rounded-full">
            {totalUnread} new
          </span>
        )}
      </div>

      {loading && <p className="text-sm text-inksoft px-6 pb-6">Loading...</p>}
      {!loading && threads.length === 0 && (
        <p className="text-sm text-inksoft italic px-6 pb-6">No conversations yet.</p>
      )}

      {!loading && threads.length > 0 && (
        <div className="flex flex-col sm:flex-row border-t border-borderpink">
          {/* Conversation list */}
          <div className="sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-borderpink max-h-56 sm:max-h-[420px] overflow-y-auto">
            {threads.map((t) => (
              <div
                key={t.visitorId}
                className={`w-full flex items-center border-b border-borderpink/60 transition-colors ${
                  active?.visitorId === t.visitorId ? 'bg-pink-50' : 'hover:bg-pink-50/50'
                }`}
              >
                <button
                  onClick={() => setActiveId(t.visitorId)}
                  className="flex-1 min-w-0 text-left px-4 py-3 flex items-center justify-between gap-2"
                >
                  <span className="text-sm font-medium truncate">{t.name}</span>
                  {t.unread > 0 && (
                    <span className="text-[10px] font-bold text-white bg-pink-600 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {t.unread}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(t.visitorId);
                  }}
                  aria-label={`Delete conversation with ${t.name}`}
                  title="Delete conversation"
                  className="flex-shrink-0 w-8 h-8 mr-1.5 flex items-center justify-center rounded-full text-inksoft/50 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          {/* Active conversation */}
          {active && (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-borderpink flex-shrink-0">
                <span className="text-sm font-semibold truncate">{active.name}</span>
                <button
                  onClick={() => deleteConversation(active.visitorId)}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex-shrink-0 flex items-center gap-1"
                >
                  <span aria-hidden="true">🗑</span> Delete chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 max-h-[420px] bg-pink-50/30">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                      m.sender === 'admin'
                        ? 'ml-auto bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-br-sm'
                        : 'mr-auto bg-surface border border-borderpink text-ink rounded-bl-sm'
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
              </div>
              <form
                onSubmit={sendReply}
                className="flex items-center gap-2 p-3 border-t border-borderpink flex-shrink-0"
              >
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={`Reply to ${active.name}...`}
                  className="flex-1 border border-borderpink rounded-full px-3.5 py-2 text-sm"
                />
                <button
                  disabled={sending || !reply.trim()}
                  className="text-sm font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-50 flex-shrink-0"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
