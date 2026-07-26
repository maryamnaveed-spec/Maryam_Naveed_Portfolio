'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ModalPortal from './ModalPortal';

export default function ResumeRequestModal({
  onClose,
  onSubmitted
}: {
  onClose: () => void;
  onSubmitted: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  const [nameError, setNameError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  function validate() {
    let ok = true;
    if (name.trim().length < 2) {
      setNameError('Please enter your full name.');
      ok = false;
    } else {
      setNameError('');
    }
    if (reason.trim().length < 10) {
      setReasonError('Please write a few words (at least 10 characters).');
      ok = false;
    } else {
      setReasonError('');
    }
    return ok;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    setServerError('');

    const { data, error } = await supabase
      .from('resume_requests')
      .insert({ name: name.trim(), reason: reason.trim(), status: 'pending' })
      .select('id')
      .single();

    if (error || !data) {
      setStatus('error');
      setServerError(error?.message || 'Something went wrong. Please try again.');
      return;
    }

    onSubmitted(data.id);
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
            <h4 className="text-lg flex items-center gap-2">
              <span aria-hidden="true">📄</span> Request resume
            </h4>
            <button
              onClick={onClose}
              className="text-inksoft text-xl leading-none hover:text-pink-600"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} noValidate>
              <label className="block text-xs font-semibold mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ayesha Khan"
                className={`w-full border rounded-lg px-3 py-2 text-sm mb-1 ${
                  nameError ? 'border-red-400' : 'border-borderpink'
                }`}
              />
              {nameError && <p className="text-xs text-red-500 mb-2">{nameError}</p>}
              <div className={nameError ? '' : 'mb-3'} />

              <label className="block text-xs font-semibold mb-1.5">
                Why do you need my resume?
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="e.g. I'd like to consider you for a design/illustration role..."
                className={`w-full border rounded-lg px-3 py-2 text-sm mb-1 ${
                  reasonError ? 'border-red-400' : 'border-borderpink'
                }`}
              />
              {reasonError && <p className="text-xs text-red-500 mb-2">{reasonError}</p>}
              <div className={reasonError ? '' : 'mb-4'} />

              {status === 'error' && (
                <p className="text-xs text-red-500 mb-3">{serverError}</p>
              )}

              <p className="text-[11.5px] text-inksoft/80 mb-4">
                Your request goes straight to Maryam. Once approved, the
                &ldquo;Request Resume&rdquo; button turns green and lets you
                download the CV once. After downloading, you&apos;ll need to
                send a new request for another copy.
              </p>

              <button
                disabled={status === 'sending'}
                className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending request...' : 'Send request'}
              </button>
            </form>
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
