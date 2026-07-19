'use client';

import { useEffect, useState } from 'react';
import { supabase, ART_SUBCATEGORIES, CALLIGRAPHY_SUBCATEGORIES, BLOG_CATEGORIES } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminManageArts from '@/components/admin/AdminManageArts';
import AdminManageBooks from '@/components/admin/AdminManageBooks';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminManageBlogs from '@/components/admin/AdminManageBlogs';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!session) {
    return (
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-10 bg-gradient-to-br from-[#160C13] via-ink to-[#5A2E4A]">
        {/* Illustrated bookshelf silhouette running along the background */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.16]"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1200 800"
        >
          {Array.from({ length: 4 }).map((_, row) => (
            <g key={row} transform={`translate(0 ${120 + row * 170})`}>
              {Array.from({ length: 26 }).map((_, i) => {
                const w = 18 + ((i * 7) % 22);
                const h = 70 + ((i * 13) % 60);
                const x = i * 46;
                const hue = i % 3 === 0 ? '#F4A6C6' : i % 3 === 1 ? '#E9C46A' : '#F1DFB8';
                return (
                  <rect
                    key={i}
                    x={x}
                    y={90 - h}
                    width={w}
                    height={h}
                    rx="2"
                    fill={hue}
                  />
                );
              })}
              <rect x="0" y="92" width="1200" height="6" fill="#F1DFB8" opacity="0.5" />
            </g>
          ))}
        </svg>

        {/* Warm reading-lamp glow behind the card */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-goldlight/20 blur-[100px]" />
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-pink-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-16 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />

        {/* Floating dust / light particles */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-goldlight/60 blur-[1px]" />
          <span className="absolute top-[70%] left-[25%] w-1 h-1 rounded-full bg-white/40 blur-[1px]" />
          <span className="absolute top-[35%] right-[18%] w-1.5 h-1.5 rounded-full bg-goldlight/50 blur-[1px]" />
          <span className="absolute top-[60%] right-[28%] w-1 h-1 rounded-full bg-white/30 blur-[1px]" />
        </div>

        <LoginForm />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <h1 className="text-3xl mb-8">Admin dashboard</h1>
        <AdminPanel />
      </div>
    </main>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="text-center mb-7">
        <div className="w-[72px] h-[72px] mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-2xl shadow-xl shadow-pink-900/40 mb-4 ring-4 ring-white/10">
          MN
        </div>
        <h1 className="text-2xl text-white font-display">Maryam Naveed</h1>
        <p className="text-xs text-goldlight/80 uppercase tracking-[0.15em] mt-1.5 font-semibold">
          Curator&rsquo;s private study
        </p>
      </div>

      <div className="relative bg-surface/95 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl shadow-black/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 rounded-full bg-gradient-to-r from-pink-400 to-gold" />
        <form onSubmit={handleLogin}>
          <p className="text-sm text-inksoft mb-5">
            Sign in to manage your art, calligraphy, books and feedback.
          </p>
          <label className="block text-xs font-semibold mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-4"
          />
          <label className="block text-xs font-semibold mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-4"
          />
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 shadow-md">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState<'upload' | 'manage' | 'messages' | 'settings'>('messages');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnreadCount(count ?? 0));
  }, [tab]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2 bg-pink-50 p-1 rounded-full">
          {(['messages', 'upload', 'manage', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-sm font-semibold px-4 py-2 rounded-full capitalize transition-colors ${
                tab === t ? 'bg-white shadow text-pink-600' : 'text-inksoft'
              }`}
            >
              {t}
              {t === 'messages' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-pink-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50"
        >
          Sign out
        </button>
      </div>

      {tab === 'messages' && <AdminMessages />}

      {tab === 'upload' && (
        <div className="space-y-10">
          <ArtUploadForm category="art" title="Upload new art" />
          <ArtUploadForm category="calligraphy" title="Upload new calligraphy" />
          <BookUploadForm />
          <BlogUploadForm />
        </div>
      )}

      {tab === 'manage' && (
        <div className="space-y-8">
          <AdminManageArts category="art" title="Manage art" />
          <AdminManageArts category="calligraphy" title="Manage calligraphy" />
          <AdminManageBooks />
          <AdminManageBlogs />
        </div>
      )}

      {tab === 'settings' && <AdminSettings />}
    </div>
  );
}

function ArtUploadForm({
  category,
  title
}: {
  category: 'art' | 'calligraphy';
  title: string;
}) {
  const [form, setForm] = useState({ title: '', description: '', subcategory: '' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const subcategoryOptions =
    category === 'art' ? ART_SUBCATEGORIES : CALLIGRAPHY_SUBCATEGORIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus('Please choose an image.');

    try {
      setStatus('Uploading image...');

      const filePath = `${category}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('art-images')
        .upload(filePath, file);
      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: publicUrl } = supabase.storage
        .from('art-images')
        .getPublicUrl(filePath);

      setStatus('Saving details...');
      const { error: insertError } = await supabase.from('arts').insert({
        title: form.title,
        category,
        subcategory: form.subcategory || subcategoryOptions[0],
        description: form.description,
        image_url: publicUrl.publicUrl
      });
      if (insertError) throw new Error(`Saving details failed: ${insertError.message}`);
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('Uploaded successfully. Refresh the homepage to see it.');
    setForm({ title: '', description: '', subcategory: '' });
    setFile(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow"
    >
      <h3 className="text-lg mb-4">{title}</h3>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      />
      <label className="block text-xs font-semibold mb-1.5">Category tag</label>
      <select
        value={form.subcategory}
        onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      >
        {subcategoryOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Short description (optional)"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        rows={2}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        required
        className="text-sm mb-3"
      />
      <br />
      <button className="mt-1 text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
        Upload
      </button>
      {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
    </form>
  );
}

function BookUploadForm() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    review: '',
    rating: 5,
    language: 'English' as 'English' | 'Urdu'
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pdfFile) return setStatus('Please choose a PDF file.');

    // Warn early about large files - Supabase free tier default limit is 50MB
    if (pdfFile.size > 50 * 1024 * 1024) {
      return setStatus(
        'This PDF is larger than 50MB. Supabase free tier has a 50MB upload limit per file - please compress the PDF or upgrade your plan.'
      );
    }

    try {
      setStatus('Uploading PDF... this can take a minute for large files.');

      const pdfPath = `${Date.now()}-${pdfFile.name}`;
      const { error: pdfError } = await supabase.storage
        .from('book-pdfs')
        .upload(pdfPath, pdfFile);
      if (pdfError) throw new Error(`PDF upload failed: ${pdfError.message}`);

      const { data: pdfPublicUrl } = supabase.storage
        .from('book-pdfs')
        .getPublicUrl(pdfPath);

      let coverUrl: string | null = null;
      if (coverFile) {
        setStatus('Uploading cover image...');
        const coverPath = `${Date.now()}-${coverFile.name}`;
        const { error: coverError } = await supabase.storage
          .from('book-covers')
          .upload(coverPath, coverFile);
        if (coverError) throw new Error(`Cover upload failed: ${coverError.message}`);
        coverUrl = supabase.storage.from('book-covers').getPublicUrl(coverPath).data.publicUrl;
      }

      setStatus('Saving book details...');
      await saveBookRecord(form, pdfPublicUrl.publicUrl, coverUrl);
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('Book uploaded successfully. Refresh the homepage to see it.');
    setForm({ title: '', author: '', review: '', rating: 5, language: 'English' });
    setPdfFile(null);
    setCoverFile(null);
  }

  async function saveBookRecord(
    formData: typeof form,
    pdfUrl: string,
    coverUrl: string | null
  ) {
    const { error: insertError } = await supabase.from('books').insert({
      title: formData.title,
      author: formData.author,
      review: formData.review,
      rating: formData.rating,
      language: formData.language,
      pdf_url: pdfUrl,
      cover_image_url: coverUrl
    });

    if (insertError) throw new Error(`Saving book failed: ${insertError.message}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow"
    >
      <h3 className="text-lg mb-4">Upload new book</h3>
      <input
        type="text"
        placeholder="Book title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      />
      <input
        type="text"
        placeholder="Author (optional)"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      />
      <label className="block text-xs font-semibold mb-1.5">Language</label>
      <select
        value={form.language}
        onChange={(e) => setForm({ ...form, language: e.target.value as 'English' | 'Urdu' })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      >
        <option value="English">English</option>
        <option value="Urdu">Urdu</option>
      </select>
      <textarea
        placeholder="Your review"
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
        rows={3}
      />
      <label className="block text-xs font-semibold mb-1.5">Rating</label>
      <select
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} star{n > 1 ? 's' : ''}
          </option>
        ))}
      </select>

      <label className="block text-xs font-semibold mb-1.5">PDF file</label>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
        required
        className="text-sm mb-3"
      />
      <br />
      <label className="block text-xs font-semibold mb-1.5">Cover image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
        className="text-sm mb-3"
      />
      <br />
      <button className="mt-1 text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
        Upload book
      </button>
      {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
    </form>
  );
}

function BlogUploadForm() {
  const [form, setForm] = useState({ title: '', content: '', category: BLOG_CATEGORIES[0] });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setStatus('Publishing...');
      let coverUrl: string | null = null;

      if (coverFile) {
        const coverPath = `${Date.now()}-${coverFile.name}`;
        const { error: coverError } = await supabase.storage
          .from('blog-covers')
          .upload(coverPath, coverFile);
        if (coverError) throw new Error(`Cover upload failed: ${coverError.message}`);
        coverUrl = supabase.storage.from('blog-covers').getPublicUrl(coverPath).data.publicUrl;
      }

      const { error: insertError } = await supabase.from('blogs').insert({
        title: form.title,
        content: form.content,
        category: form.category,
        cover_image_url: coverUrl
      });
      if (insertError) throw new Error(`Publishing failed: ${insertError.message}`);
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('Blog post published. Refresh the homepage to see it.');
    setForm({ title: '', content: '', category: BLOG_CATEGORIES[0] });
    setCoverFile(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow"
    >
      <h3 className="text-lg mb-4">Write a new blog post</h3>
      <input
        type="text"
        placeholder="Blog title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      />
      <label className="block text-xs font-semibold mb-1.5">Category</label>
      <select
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      >
        {BLOG_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <textarea
        placeholder="Write your blog post here..."
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        required
        rows={8}
        className="w-full border border-borderpink rounded-lg px-3 py-2 text-sm mb-3"
      />
      <label className="block text-xs font-semibold mb-1.5">Cover image (optional)</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
        className="text-sm mb-3"
      />
      <br />
      <button className="mt-1 text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600">
        Publish blog post
      </button>
      {status && <p className="text-xs text-inksoft mt-3">{status}</p>}
    </form>
  );
}
