'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ModalPortal from './ModalPortal';

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email || 'not provided',
      message: form.message
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('sent');
  }

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 bg-ink/55 flex items-center justify-center z-[200] p-5 animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      >
        <div
          className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-[zoomIn_0.25s_ease-out]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-borderpink">
            <h4 className="text-lg">Share your feedback</h4>
            <button
              onClick={onClose}
              className="text-inksoft text-xl leading-none hover:text-pink-600"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            {status === 'sent' ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-3">💌</div>
                <p className="text-inksoft text-sm">
                  Thank you for your feedback! Maryam will read it soon.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label className="block text-xs font-semibold mb-1.5">Your name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
                />
                <label className="block text-xs font-semibold mb-1.5">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
                />
                <label className="block text-xs font-semibold mb-1.5">Your feedback</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your thoughts about the art, calligraphy, or books..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-4"
                />
                {status === 'error' && (
                  <p className="text-xs text-red-500 mb-3">{errorMsg}</p>
                )}
                <button
                  disabled={status === 'sending'}
                  className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending...' : 'Send feedback'}
                </button>
              </form>
            )}
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </ModalPortal>
  );
}
