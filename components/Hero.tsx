'use client';

import FeedbackButton from './FeedbackButton';
import CalligraphyAnimation from './CalligraphyAnimation';
import Bookshelf3D from './Bookshelf3D';
import ParticlesBackground from './ParticlesBackground';

export default function Hero({ backgroundImage }: { backgroundImage?: string | null }) {
  const bgUrl = backgroundImage || '/images/hero-bgf.png';

  return (
    <section
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat py-16 sm:py-0"
      style={{
        backgroundImage: `url('${bgUrl}')`,
      }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .anim {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .anim {
            opacity: 1;
            animation: none;
            transform: none;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/5 to-transparent"></div>

      <ParticlesBackground />

      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-100/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-goldlight/10 blur-3xl" />

      <div className="hidden xl:block absolute right-6 top-1/2 -translate-y-1/2 z-0 opacity-90">
        <Bookshelf3D />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 relative z-10 grid lg:grid-cols-[1fr_1.05fr] gap-8 items-center w-full">
        <div className="hidden lg:block">
          <CalligraphyAnimation />
        </div>

        <div
          className="
            text-left
            bg-black/30
            backdrop-blur-sm
            rounded-2xl sm:rounded-3xl
            p-6 sm:p-8 md:p-10
            border border-white/10
            shadow-2xl
            max-w-2xl
            w-full
          "
        >
          <div className="anim flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 justify-start flex-wrap" style={{ animationDelay: '0.05s' }}>
            <span className="h-px w-6 sm:w-8 bg-pink-300/70"></span>
            <span className="text-pink-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em]">
              Curator of Mind, Ink &amp; Canvas
            </span>
            <span className="h-px w-6 sm:w-8 bg-pink-300/70"></span>
          </div>

          <h1 className="font-serif leading-[1.1] drop-shadow-2xl">
            <span
              className="anim block text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium"
              style={{ animationDelay: '0.15s' }}
            >
              I am
            </span>
            <span
              className="anim block italic text-pink-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-1 tracking-wide"
              style={{ animationDelay: '0.25s', fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              Maryam
            </span>
            <span
              className="anim flex items-baseline flex-wrap gap-x-3 italic text-pink-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide"
              style={{ animationDelay: '0.35s', fontFamily: "'Playfair Display', 'Georgia', serif" }}
            >
              Naveed
              <span
                dir="rtl"
                lang="ur"
                className="anim not-italic text-pink-300/90 text-lg sm:text-xl md:text-2xl lg:text-3xl font-normal"
                style={{
                  animationDelay: '0.5s',
                  fontFamily: "'Noto Nastaliq Urdu', serif",
                }}
              >
                (مریم)
              </span>
            </span>
          </h1>

          <svg
            className="anim mt-3 mb-4 w-24 sm:w-32 h-3 text-pink-400/80"
            viewBox="0 0 160 16"
            fill="none"
            style={{ animationDelay: '0.62s' }}
          >
            <path
              d="M2 8 Q 20 2, 40 8 T 78 8 T 116 8 T 158 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <p
            className="anim text-white/90 text-sm sm:text-base md:text-lg font-medium mb-5 sm:mb-6"
            style={{ animationDelay: '0.72s' }}
          >
            Calligrapher | Librarian | Artist | Psychiatrist
          </p>

          <p
            className="anim text-white/80 mb-6 sm:mb-8 max-w-xl leading-relaxed text-sm sm:text-[15px] md:text-base"
            style={{ animationDelay: '0.82s' }}
          >
            I am a librarian, and calligraphy enthusiast with a deep
            appreciation for knowledge, creativity, and human understanding.
            My journey is inspired by the belief that books expand our minds,
            art gives shape to emotions, and every individual carries a
            unique story worth discovering.
          </p>

          <div
            className="anim flex flex-wrap justify-start gap-3 sm:gap-4"
            style={{ animationDelay: '0.92s' }}
          >
            <FeedbackButton className="px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-400/25 hover:shadow-pink-400/40 transition-shadow" />
            <a
              href="#art"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm border border-white/40 text-white hover:bg-white/10 transition-colors"
            >
              View art gallery
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
