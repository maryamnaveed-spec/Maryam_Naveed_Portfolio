'use client';

import TypewriterText from './TypewriterText';
import FeedbackButton from './FeedbackButton';

export default function Hero() {
  return (
    <section className="pt-20 pb-14 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-goldlight/30 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-14 items-center relative">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-5">
            Curator of mind, ink & canvas
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-3">
            I am <em className="italic text-pink-600">Maryam Naveed</em>
          </h1>

          <p className="text-lg font-medium text-inksoft mb-6 min-h-[1.6em]">
            <TypewriterText
              words={['Librarian', 'Artist', 'Calligrapher', 'Psychiatrist']}
              typingSpeed={45}
              deletingSpeed={25}
              pauseTime={900}
            />
          </p>

          <p className="text-inksoft mb-7 max-w-xl leading-relaxed text-[15px]">
            I am a librarian and calligraphy enthusiast with a deep
            appreciation for knowledge, creativity, and human understanding.
            My journey is inspired by the belief that books expand our
            minds, art gives shape to emotions, and every individual
            carries a unique story worth discovering.
          </p>

          <div className="flex flex-wrap gap-3">
            <FeedbackButton className="px-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-400/25 hover:shadow-pink-400/40 transition-shadow" />
            <a
              href="#art"
              className="px-6 py-3 rounded-full font-semibold text-sm border border-borderpink text-inksoft hover:bg-pink-50 transition-colors"
            >
              View art gallery
            </a>
          </div>
        </div>

        <div className="rounded-2xl p-7 sm:p-8 text-white relative overflow-hidden bg-gradient-to-br from-ink to-[#5A2E4A] shadow-2xl shadow-ink/20">
          <span className="inline-block text-[10px] tracking-wide uppercase bg-white/10 px-3 py-1 rounded-full mb-5">
            Philosopher persona
          </span>
          <h3 className="text-white text-xl mb-4">Maryam Naveed</h3>
          <p className="quote text-2xl leading-snug text-goldlight">
            &ldquo;Every book tells a story. Every artwork expresses an
            emotion. Every mind holds a unique perspective&mdash;and I
            believe each deserves to be understood.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
