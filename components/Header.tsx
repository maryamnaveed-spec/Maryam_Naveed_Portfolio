'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FeedbackButton from './FeedbackButton';
import ResumeRequestButton from './ResumeRequestButton';
import {
  ART_SUBCATEGORIES,
  CALLIGRAPHY_SUBCATEGORIES,
  supabase
} from '@/lib/supabase';
import { useFilters } from './FiltersProvider';

function NavDropdown({
  label,
  options,
  onSelect,
  onNavigate
}: {
  label: string;
  options: string[];
  onSelect: (v: string) => void;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={onNavigate}
        className="flex items-center gap-1 hover:text-pink-600 transition-colors"
      >
        {label}
        <span className="text-[10px] mt-0.5">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-3 z-40">
          <div className="bg-surface border border-borderpink rounded-xl shadow-xl py-2 w-44 glass-card">
            {['All', ...options].map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onNavigate();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BooksNavDropdown({ onBooks, onAudioBooks }: { onBooks: () => void; onAudioBooks: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={onBooks}
        className="flex items-center gap-1 hover:text-pink-600 transition-colors"
      >
        My Books
        <span className="text-[10px] mt-0.5">▾</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-3 z-40">
          <div className="bg-surface border border-borderpink rounded-xl shadow-xl py-2 w-44 glass-card">
            <button
              onClick={() => {
                onBooks();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600"
            >
              📚 Books
            </button>
            <button
              onClick={() => {
                onAudioBooks();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-inksoft hover:bg-pink-50 hover:text-pink-600"
            >
              🎧 Audio Books
            </button>
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
  const { setArtFilter, setCalligraphyFilter } = useFilters();
  const router = useRouter();
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

  // Works from any page: if we're already on the homepage, just smooth-scroll;
  // otherwise navigate to the homepage first, then Next.js scrolls to the
  // section matching the #hash once the page has loaded.
  function goToSection(id: string) {
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push(`/#${id}`);
    }
  }

  return (
    <header
      className={`bg-surface/90 backdrop-blur-md border-b sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? 'border-borderpink shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-lg shadow-md shadow-pink-400/20">
            {profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profileImage} alt="Maryam Naveed" className="w-full h-full object-cover" />
            ) : (
              'MN'
            )}
          </div>
          <div>
            <div className="font-display font-semibold text-lg sm:text-xl leading-tight">
              Maryam Naveed
            </div>
            <div className="text-[10px] sm:text-[11px] tracking-wide uppercase text-pink-600 font-semibold">
              Curator of mind & art
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex gap-7 text-sm font-medium text-inksoft">
          <NavDropdown
            label="My Art"
            options={ART_SUBCATEGORIES}
            onSelect={setArtFilter}
            onNavigate={() => goToSection('art')}
          />
          <NavDropdown
            label="My Calligraphy"
            options={CALLIGRAPHY_SUBCATEGORIES}
            onSelect={setCalligraphyFilter}
            onNavigate={() => goToSection('calligraphy')}
          />
          <BooksNavDropdown
            onBooks={() => goToSection('books')}
            onAudioBooks={() => router.push('/audiobooks')}
          />
          <button
            onClick={() => goToSection('blog')}
            className="hover:text-pink-600 transition-colors"
          >
            Blog
          </button>
          <Link href="/recite" className="hover:text-pink-600 transition-colors">
            Recite
          </Link>
          <Link href="/about" className="hover:text-pink-600 transition-colors">
            Owner
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ResumeRequestButton />
          <Link
            href="/admin"
            className="text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft hover:bg-pink-50 transition-colors"
          >
            Admin
          </Link>
          <FeedbackButton className="text-sm font-semibold px-5 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-md shadow-pink-400/20 hover:shadow-pink-400/35 transition-shadow" />
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
        <div className="lg:hidden border-t border-borderpink bg-surface px-5 py-4 flex flex-col gap-1">
          <button
            onClick={() => {
              goToSection('art');
              setMenuOpen(false);
            }}
            className="text-left py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            My Art
          </button>
          <button
            onClick={() => {
              goToSection('calligraphy');
              setMenuOpen(false);
            }}
            className="text-left py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            My Calligraphy
          </button>
          <button
            onClick={() => {
              goToSection('books');
              setMenuOpen(false);
            }}
            className="text-left py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            📚 My Books
          </button>
          <Link
            href="/audiobooks"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            🎧 Audio Books
          </Link>
          <button
            onClick={() => {
              goToSection('blog');
              setMenuOpen(false);
            }}
            className="text-left py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            Blog
          </button>
          <Link
            href="/recite"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            Recite
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="py-2.5 text-sm font-medium text-inksoft hover:text-pink-600"
          >
            Owner
          </Link>
          <div className="pt-3">
            <ResumeRequestButton className="w-full block text-center text-sm font-semibold px-4 py-2 rounded-full border transition-colors" />
          </div>
          <div className="flex gap-3 pt-3">
            <Link
              href="/admin"
              className="flex-1 text-center text-sm font-semibold px-4 py-2 rounded-full border border-borderpink text-inksoft"
            >
              Admin
            </Link>
            <FeedbackButton className="flex-1 text-sm font-semibold px-4 py-2 rounded-full text-white bg-gradient-to-br from-pink-400 to-pink-600" />
          </div>
        </div>
      )}
    </header>
  );
}
