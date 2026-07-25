'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <ProfileImageEditor />
      <BackgroundImageEditor />
      <QuoteOfDayEditor />
      <CommentsToggle />
      <ChangePasswordForm />
    </div>
  );
}

function ProfileImageEditor() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    supabase
      .from('settings')
      .select('profile_image_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setCurrentUrl(data?.profile_image_url ?? null);
        setLoading(false);
      });
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus('Please choose an image.');

    try {
      setStatus('Uploading...');
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(path, file);
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage.from('profile-images').getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('settings')
        .update({ profile_image_url: publicUrl.publicUrl })
        .eq('id', 1);
      if (updateError) throw new Error(updateError.message);

      setCurrentUrl(publicUrl.publicUrl);
      setFile(null);
      setStatus('Profile photo updated across the site.');
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong.');
    }
  }

  async function handleReset() {
    await supabase.from('settings').update({ profile_image_url: null }).eq('id', 1);
    setCurrentUrl(null);
    setStatus('Reverted to the default "MN" logo circle.');
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-3">Profile photo</h3>
      <p className="text-sm text-inksoft mb-4">
        This photo replaces the "MN" circle logo in the navigation bar across
        the whole site.
      </p>

      {!loading && (
        <div className="mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-display font-semibold flex-shrink-0">
            {currentUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              'MN'
            )}
          </div>
          {currentUrl && (
            <button
              onClick={handleReset}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
            >
              Remove photo
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm mb-3"
        />
        <br />
        <button className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
          Upload profile photo
        </button>
      </form>
      {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
    </div>
  );
}

function QuoteOfDayEditor() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle');
  const [error, setError] = useState('');

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
    setError('');
    const { error: updateError } = await supabase
      .from('settings')
      .update({ quote_of_day: quote })
      .eq('id', 1);

    if (updateError) {
      setStatus('idle');
      setError(updateError.message);
      return;
    }

    setStatus('done');
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-3">Quote of the Day</h3>
      <p className="text-sm text-inksoft mb-4">
        Appears next to Artwork of the Week and Book of the Month on the
        homepage.
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
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </form>
      )}
    </div>
  );
}

function BackgroundImageEditor() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    supabase
      .from('settings')
      .select('background_image_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setCurrentUrl(data?.background_image_url ?? null);
        setLoading(false);
      });
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus('Please choose an image.');

    try {
      setStatus('Uploading...');
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('site-backgrounds')
        .upload(path, file);
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage.from('site-backgrounds').getPublicUrl(path);

      const { error: updateError } = await supabase
        .from('settings')
        .update({ background_image_url: publicUrl.publicUrl })
        .eq('id', 1);
      if (updateError) throw new Error(updateError.message);

      setCurrentUrl(publicUrl.publicUrl);
      setFile(null);
      setStatus('Background updated. Refresh the homepage to see it.');
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong.');
    }
  }

  async function handleReset() {
    await supabase.from('settings').update({ background_image_url: null }).eq('id', 1);
    setCurrentUrl(null);
    setStatus('Reverted to the default homepage background.');
  }

  return (
    <div className="bg-surface border border-borderpink rounded-card p-6 card-shadow max-w-md">
      <h3 className="text-lg mb-3">Homepage background</h3>
      <p className="text-sm text-inksoft mb-4">
        Upload an HD photo to replace the homepage hero background. It will
        automatically be cropped to fill the same space and size as the
        current one — no layout changes.
      </p>

      {!loading && currentUrl && (
        <div className="mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Current background"
            className="w-full h-28 object-cover rounded-lg mb-2"
          />
          <button
            onClick={handleReset}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50"
          >
            Revert to default background
          </button>
        </div>
      )}

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm mb-3"
        />
        <br />
        <button className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
          Upload new background
        </button>
      </form>
      {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
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
