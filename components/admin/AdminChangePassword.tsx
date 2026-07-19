'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');

    if (newPassword !== confirmPassword) {
      return setStatus('New password and confirmation do not match.');
    }
    if (newPassword.length < 6) {
      return setStatus('New password must be at least 6 characters.');
    }

    setSaving(true);

    // Verify the old password is correct by re-authenticating
    const { data: userData } = await supabase.auth.getUser();
    const email = userData.user?.email;

    if (!email) {
      setSaving(false);
      return setStatus('Could not verify your account. Please sign in again.');
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword
    });

    if (verifyError) {
      setSaving(false);
      return setStatus('Your current password is incorrect.');
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    setSaving(false);

    if (updateError) {
      return setStatus(updateError.message);
    }

    setStatus('Password updated successfully.');
    setOldPassword('');
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
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
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
        {status && (
          <p
            className={`text-xs mb-3 ${
              status.includes('successfully') ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {status}
          </p>
        )}
        <button
          disabled={saving}
          className="px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 disabled:opacity-60"
        >
          {saving ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
