'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase, ART_SUBCATEGORIES, CALLIGRAPHY_SUBCATEGORIES, BLOG_CATEGORIES } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminManageArts from '@/components/admin/AdminManageArts';
import AdminManageBooks from '@/components/admin/AdminManageBooks';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminManageBlogs from '@/components/admin/AdminManageBlogs';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminResumeRequests from '@/components/admin/AdminResumeRequests';
import AdminChat from '@/components/admin/AdminChat';

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
      <main className="min-h-screen relative overflow-hidden flex items-center justify-center px-5 py-10">
        {/* Cozy library photo backdrop */}
        <Image
          src="/images/admin-login-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark wash so the login card text stays fully readable over the photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#160C13]/92 via-[#2a1620]/85 to-[#5A2E4A]/80" />

        {/* Animated spotlight shade directly behind the card, so the login
            box and its text stay clearly legible no matter how bright the
            backdrop photo is in that spot */}
        <div className="admin-login-shade pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[640px] max-w-[95vw] max-h-[95vw] rounded-full" />
        <style jsx>{`
          .admin-login-shade {
            background: radial-gradient(circle, rgba(10, 5, 8, 0.75) 0%, rgba(10, 5, 8, 0.35) 45%, rgba(10, 5, 8, 0) 72%);
            animation: shadeBreathe 6s ease-in-out infinite;
          }
          @keyframes shadeBreathe {
            0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
          }
          @media (prefers-reduced-motion: reduce) {
            .admin-login-shade { animation: none; opacity: 0.95; }
          }
        `}</style>

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
      <div className="h-1.5 w-full bg-gradient-to-r from-pink-400 via-gold to-pink-600" />
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-lg shadow-md flex-shrink-0">
            MN
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl leading-tight">Admin dashboard</h1>
            <p className="text-xs text-inksoft">Manage your art, calligraphy, books &amp; blog</p>
          </div>
        </div>
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
    <div className="relative w-full max-w-sm animate-fadeUp">
      <div className="text-center mb-7">
        <div className="w-[76px] h-[76px] mx-auto rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-2xl shadow-xl shadow-pink-900/40 mb-4 ring-4 ring-white/15">
          MN
        </div>
        <h1 className="text-2xl text-white font-display">Maryam Naveed</h1>
        <p className="text-xs text-goldlight/80 uppercase tracking-[0.15em] mt-1.5 font-semibold">
          Curator&rsquo;s private study
        </p>
      </div>

      <div className="relative bg-surface/95 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl shadow-black/50">
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
            className="w-full border border-borderpink rounded-lg px-3 py-2.5 text-sm mb-4 bg-bg focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-shadow"
          />
          <label className="block text-xs font-semibold mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-borderpink rounded-lg px-3 py-2.5 text-sm mb-4 bg-bg focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 transition-shadow"
          />
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button className="w-full py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-br from-pink-400 to-pink-600 shadow-md shadow-pink-500/30 hover:shadow-lg hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

type AdminTab = 'upload' | 'manage' | 'messages' | 'settings' | 'reviews' | 'resume' | 'chat';

function AdminPanel() {
  const [tab, setTab] = useState<AdminTab>('messages');
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadReviews, setUnreadReviews] = useState(0);
  const [pendingResume, setPendingResume] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnreadCount(count ?? 0));
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .then(({ count }) => setUnreadReviews(count ?? 0));
    supabase
      .from('resume_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => setPendingResume(count ?? 0));
    supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender', 'user')
      .eq('is_read', false)
      .then(({ count }) => setUnreadChats(count ?? 0));
  }, [tab]);

  const tabIcons: Record<AdminTab, string> = {
    messages: '💬',
    reviews: '⭐',
    chat: '🗨️',
    resume: '📄',
    upload: '⬆️',
    manage: '🗂️',
    settings: '⚙️'
  };

  const badgeCounts: Partial<Record<AdminTab, number>> = {
    messages: unreadCount,
    reviews: unreadReviews,
    resume: pendingResume,
    chat: unreadChats
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap justify-start gap-1.5 bg-pink-50 p-1.5 rounded-2xl sm:rounded-full w-full sm:w-auto">
          {(['messages', 'reviews', 'chat', 'resume', 'upload', 'manage', 'settings'] as const).map(
            (t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full capitalize whitespace-nowrap flex-shrink-0 transition-all duration-300 ${
                  tab === t
                    ? 'bg-white shadow-md text-pink-600 scale-[1.03]'
                    : 'text-inksoft hover:bg-white/60'
                }`}
              >
                <span aria-hidden="true">{tabIcons[t]}</span>
                {t}
                {(badgeCounts[t] ?? 0) > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-pink-600 rounded-full ring-2 ring-white">
                    {badgeCounts[t]}
                  </span>
                )}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 hover:border-pink-300 transition-colors self-start"
        >
          Sign out
        </button>
      </div>

      <div key={tab} className="animate-fadeUp">
        {tab === 'messages' && <AdminMessages />}

        {tab === 'reviews' && <AdminReviews />}

        {tab === 'chat' && <AdminChat />}

        {tab === 'resume' && <AdminResumeRequests />}

        {tab === 'upload' && (
          <div className="grid gap-6 sm:grid-cols-2 items-start">
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
  const [gifFile, setGifFile] = useState<File | null>(null);
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

      let gifUrl: string | null = null;
      if (gifFile) {
        setStatus('Uploading before/after GIF...');
        const gifPath = `${category}/${Date.now()}-${gifFile.name}`;
        const { error: gifError } = await supabase.storage
          .from('art-before-after')
          .upload(gifPath, gifFile);
        if (gifError) throw new Error(`GIF upload failed: ${gifError.message}`);
        gifUrl = supabase.storage.from('art-before-after').getPublicUrl(gifPath).data.publicUrl;
      }

      setStatus('Saving details...');
      const { error: insertError } = await supabase.from('arts').insert({
        title: form.title,
        category,
        subcategory: form.subcategory || subcategoryOptions[0],
        description: form.description,
        image_url: publicUrl.publicUrl,
        before_after_gif_url: gifUrl
      });
      if (insertError) throw new Error(`Saving details failed: ${insertError.message}`);
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong. Please try again.');
      return;
    }

    setStatus('Uploaded successfully. Refresh the homepage to see it.');
    setForm({ title: '', description: '', subcategory: '' });
    setFile(null);
    setGifFile(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow w-full h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
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
      <label className="block text-xs font-semibold mb-1.5">
        Before/After GIF (optional)
      </label>
      <input
        type="file"
        accept="image/gif,image/*"
        onChange={(e) => setGifFile(e.target.files?.[0] ?? null)}
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
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow w-full h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
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
      className="bg-surface border border-borderpink rounded-card p-6 card-shadow w-full h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
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
