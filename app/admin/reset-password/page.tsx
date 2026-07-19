'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push('/admin'), 2000);
  }

  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-10 bg-gradient-to-br from-ink via-[#5A2E4A] to-[#7A3E5E]">
      <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-goldlight/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-16 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 flex flex-wrap gap-10 justify-around items-center opacity-[0.06] text-white text-6xl select-none">
        <span>📚</span><span>🖋️</span><span>📖</span><span>🎨</span>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-2xl shadow-lg mb-3">
            MN
          </div>
          <h1 className="text-2xl text-white font-display">Set a new password</h1>
        </div>

        <div className="bg-surface/95 backdrop-blur border border-white/20 rounded-2xl p-7 shadow-2xl">
          {done ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-3">✅</div>
              <p className="text-sm text-inksoft">
                Password updated. Redirecting you to sign in...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label className="block text-xs font-semibold mb-1.5">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
              />
              <label className="block text-xs font-semibold mb-1.5">Confirm new password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-4"
              />
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <button className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 shadow-md">
                Update password
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
