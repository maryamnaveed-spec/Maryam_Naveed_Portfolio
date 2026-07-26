'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase, ChatMessageItem } from '@/lib/supabase';

const VISITOR_ID_KEY = 'chat_visitor_id';
const VISITOR_NAME_KEY = 'chat_visitor_name';
const cacheKey = (visitorId: string) => `chat_cache_${visitorId}`;

function makeVisitorId() {
  return 'v_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type LiteMessage = Pick<ChatMessageItem, 'id' | 'sender' | 'message' | 'created_at'>;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState('');
  const [name, setName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [messages, setMessages] = useState<LiteMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [unread, setUnread] = useState(0);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load / create the visitor identity + local cache once on mount.
  useEffect(() => {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = makeVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    setVisitorId(vid);

    const savedName = localStorage.getItem(VISITOR_NAME_KEY) || '';
    setName(savedName);

    const cached = localStorage.getItem(cacheKey(vid));
    if (cached) {
      try {
        setMessages(JSON.parse(cached));
      } catch {
        /* ignore corrupt cache */
      }
    }
  }, []);

  function saveCache(vid: string, msgs: LiteMessage[]) {
    localStorage.setItem(cacheKey(vid), JSON.stringify(msgs));
  }

  async function syncMessages(vid: string, isOpen: boolean) {
    const { data } = await supabase
      .from('chat_messages')
      .select('id, sender, message, created_at')
      .eq('visitor_id', vid)
      .order('created_at', { ascending: true });

    if (!data) return;

    setMessages((prev) => {
      if (data.length > prev.length) {
        const newOnes = data.slice(prev.length).filter((m) => m.sender === 'admin');
        if (newOnes.length > 0 && !isOpen) {
          setUnread((u) => u + newOnes.length);
        }
      }
      saveCache(vid, data as LiteMessage[]);
      return data as LiteMessage[];
    });
  }

  // Poll for admin replies once we have a visitor id.
  useEffect(() => {
    if (!visitorId) return;
    syncMessages(visitorId, open);
    pollRef.current = setInterval(() => syncMessages(visitorId, open), 8000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitorId, open]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }
  }, [open, messages]);

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    if (nameInput.trim().length < 2) return;
    localStorage.setItem(VISITOR_NAME_KEY, nameInput.trim());
    setName(nameInput.trim());
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !visitorId || !name) return;

    setSending(true);
    const optimistic: LiteMessage = {
      id: `local-${Date.now()}`,
      sender: 'user',
      message: draft.trim(),
      created_at: new Date().toISOString()
    };
    const next = [...messages, optimistic];
    setMessages(next);
    saveCache(visitorId, next);
    setDraft('');

    await supabase.from('chat_messages').insert({
      visitor_id: visitorId,
      name,
      sender: 'user',
      message: optimistic.message
    });

    await syncMessages(visitorId, true);
    setSending(false);
  }

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[150] flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[88vw] max-w-[340px] h-[65vh] max-h-[480px] bg-surface border border-borderpink rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[zoomIn_0.2s_ease-out]">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-pink-400 to-pink-600 text-white flex-shrink-0">
            <span className="text-sm font-semibold flex items-center gap-2">
              <span aria-hidden="true">💬</span> Talk to Admin
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/90 hover:text-white text-lg leading-none"
              aria-label="Close chat"
            >
              &times;
            </button>
          </div>

          {!name ? (
            <form onSubmit={saveName} className="flex-1 flex flex-col justify-center p-5 gap-3">
              <p className="text-sm text-inksoft">
                Enter your name to start chatting with Maryam.
              </p>
              <input
                type="text"
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm"
              />
              <button className="text-sm font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
                Start chat
              </button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-pink-50/40">
                {messages.length === 0 && (
                  <p className="text-xs text-inksoft/70 text-center mt-6">
                    Say hello, {name}! Your messages are saved on this device.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                      m.sender === 'user'
                        ? 'ml-auto bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-br-sm'
                        : 'mr-auto bg-surface border border-borderpink text-ink rounded-bl-sm'
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
              </div>
              <form
                onSubmit={sendMessage}
                className="flex items-center gap-2 p-2.5 border-t border-borderpink flex-shrink-0"
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-borderpink rounded-full px-3.5 py-2 text-sm"
                />
                <button
                  disabled={sending || !draft.trim()}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-50"
                  aria-label="Send"
                >
                  ➤
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-14 h-14 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-xl shadow-pink-500/30 flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-transform"
        aria-label="Talk to Admin"
      >
        {open ? '✕' : '💬'}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>

      <style jsx global>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
