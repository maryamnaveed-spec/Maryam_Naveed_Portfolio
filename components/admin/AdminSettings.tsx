'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <QuoteOfDayEditor />
      <CommentsToggle />
      <ChangePasswordForm />
    </div>
  );
}

function QuoteOfDayEditor() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');

  useEffect(() => {
    supabase
      .from('settings')
      .select('quote_of_day')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setQuote(data?.quote_of_day ?? '');
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    await supabase.from('settings').update({ quote_of_day: quote }).eq('id', 1);
    setStatus('done');
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-3">Quote of the Day</h3>
      <p className="text-sm text-inksoft mb-4">
        This quote appears in the homepage highlights section.
      </p>
      {!loading && (
        <form onSubmit={handleSave}>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
          />
          <button className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
            {status === 'saving' ? 'Saving...' : status === 'done' ? 'Saved ✓' : 'Save quote'}
          </button>
        </form>
      )}
    </div>
  );
}

function CommentsToggle() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('settings')
      .select('comments_enabled')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setEnabled(data?.comments_enabled ?? true);
        setLoading(false);
      });
  }, []);

  async function toggle() {
    const newValue = !enabled;
    setEnabled(newValue);
    await supabase.from('settings').update({ comments_enabled: newValue }).eq('id', 1);
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-3">Reader comments</h3>
      <p className="text-sm text-inksoft mb-4">
        Allow visitors to leave a comment/view on your art, calligraphy and
        books.
      </p>
      {!loading && (
        <button
          onClick={toggle}
          className={`w-full flex items-center justify-between text-sm font-semibold px-4 py-2.5 rounded-full border ${
            enabled ? 'border-pink-400 text-pink-600 bg-pink-50' : 'border-borderpink text-inksoft'
          }`}
        >
          <span>{enabled ? 'Comments are ON' : 'Comments are OFF'}</span>
          <span>{enabled ? '✅' : '🚫'}</span>
        </button>
      )}
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setStatus('saving');

    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email;
    if (!email) {
      setStatus('error');
      setError('Could not verify your account. Please sign in again.');
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword
    });

    if (reauthError) {
      setStatus('error');
      setError('Current password is incorrect.');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setStatus('error');
      setError(updateError.message);
      return;
    }

    setStatus('done');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-4">Change password</h3>
      <form onSubmit={handleSubmit}>
        <label className="block text-xs font-semibold mb-1.5">Current password</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        />
        <label className="block text-xs font-semibold mb-1.5">New password</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        />
        <label className="block text-xs font-semibold mb-1.5">Confirm new password</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-4"
        />
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        {status === 'done' && (
          <p className="text-xs text-green-600 mb-3">Password updated successfully.</p>
        )}
        <button
          disabled={status === 'saving'}
          className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
        >
          {status === 'saving' ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
