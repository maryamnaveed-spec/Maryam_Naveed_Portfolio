'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

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

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}
