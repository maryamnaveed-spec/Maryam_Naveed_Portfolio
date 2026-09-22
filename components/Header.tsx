'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeedbackButton from './FeedbackButton';
import ResumeRequestButton from './ResumeRequestButton';
import { supabase } from '@/lib/supabase';

const NAV_LINKS = [
  { href: '/gallery', label: 'My Gallery' },
  { href: '/scriptorium', label: 'My Calligraphy' },
  { href: '/library', label: 'My Library' },
  { href: '/stories', label: 'My Stories' }
];

function MoreDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full tracking-wide hover:text-pink-600 hover:bg-pink-50/60 transition-colors">
        More
        <span className={`text-[10px] mt-0.5 transition-transform duration-200 ${open ? '-rotate-180' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="absolute top-full right-0 pt-3 z-40">
          <div className="bg-surface border border-borderpink rounded-xl shadow-xl py-2 w-48 glass-card animate-fadeUp origin-top-right">
            <Link href="/blog" className="block px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600 transition-colors">
              ✍️ Blog
            </Link>
            <Link href="/recite" className="block px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600 transition-colors">
              📖 Recite Quran
            </Link>
            <Link href="/about" className="block px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600 transition-colors">
              👤 About the Owner
            </Link>
            <Link href="/admin" className="block px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600 transition-colors">
              ⚙️ Admin
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase
      .from('settings')
      .select('profile_image_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => setProfileImage(data?.profile_image_url ?? null));
  }, []);

  return (
    <header
      className={`bg-surface/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'border-borderpink shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]' : 'border-borderpink/60'
      }`}
    >
      <div className="h-[2px] w-full bg-gradient-to-r from-pink-400/70 via-gold/70 to-pink-600/70" />
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-lg shadow-md shadow-pink-600/25 ring-2 ring-white/70 group-hover:ring-pink-200 transition-all">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Maryam Naveed" className="w-full h-full object-cover" />
            ) : (
              'MN'
            )}
          </div>
          <div>
            <div className="font-display font-semibold text-lg sm:text-xl leading-tight text-ink">
              Maryam Naveed
            </div>
            <div className="text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-gold font-semibold">
              Curator of mind &amp; art
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-inksoft tracking-wide">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-full transition-colors ${
                  active ? 'text-pink-600 bg-pink-50' : 'hover:text-pink-600 hover:bg-pink-50/60'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute left-3.5 right-3.5 -bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-pink-400 to-pink-600" />
                )}
              </Link>
            );
          })}
          <div className="px-1.5">
            <MoreDropdown />
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <ResumeRequestButton className="text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors" />
          <FeedbackButton className="text-[13px] font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-md shadow-pink-600/20 hover:shadow-lg hover:shadow-pink-600/30 hover:-translate-y-0.5 transition-all" />
        </div>

        <button
          className="lg:hidden w-9 h-9 flex items-center justify-center text-inksoft"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl leading-none">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-borderpink bg-surface px-5 py-4 flex flex-col gap-1 animate-fadeUp origin-top">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`py-2.5 text-sm font-medium ${
                pathname === link.href ? 'text-pink-600' : 'text-inksoft hover:text-pink-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/blog"
            onClick={() => setMenuOpen(false)}
            className={`py-2.5 text-sm font-medium ${pathname === '/blog' ? 'text-pink-600' : 'text-inksoft hover:text-pink-600'}`}
          >
            Blog
          </Link>

          <div className="border-t border-borderpink my-2"></div>

          <Link
            href="/recite"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            📖 Recite Quran
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            👤 About the Owner
          </Link>
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            ⚙️ Admin
          </Link>

          <div className="pt-3">
            <ResumeRequestButton className="w-full block text-center text-sm font-semibold px-4 py-2 rounded-full border transition-colors" />
          </div>
          <div className="pt-3">
            <FeedbackButton className="w-full block text-center text-sm font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600" />
          </div>
        </div>
      )}
    </header>
  );
}
