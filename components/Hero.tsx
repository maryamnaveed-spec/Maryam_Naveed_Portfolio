'use client';

import TypewriterText from './TypewriterText';
import FeedbackButton from './FeedbackButton';
import CalligraphyAnimation from './CalligraphyAnimation';
import Bookshelf3D from './Bookshelf3D';
import ParticlesBackground from './ParticlesBackground';

export default function Hero() {
  return (
    <section className="pt-16 pb-10 relative overflow-hidden">
      <ParticlesBackground />
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-goldlight/30 blur-3xl" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative grid lg:grid-cols-[0.65fr_1.7fr_0.65fr] gap-8 items-center">
        {/* Left: live calligraphy animation */}
        <div className="hidden lg:block">
          <CalligraphyAnimation />
        </div>

        {/* Center: main hero content */}
        <div className="text-center lg:text-left">
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

          <p className="text-inksoft mb-7 max-w-xl mx-auto lg:mx-0 leading-relaxed text-[15px]">
            I am a librarian, painter, and calligraphy enthusiast with a deep
            appreciation for knowledge, creativity, and human understanding.
            My journey is inspired by the belief that books expand our
            minds, art gives shape to emotions, and every individual
            carries a unique story worth discovering.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <FeedbackButton className="px-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-400/25 hover:shadow-pink-400/40 transition-shadow" />
            <a
              href="#art"
              className="px-6 py-3 rounded-full font-semibold text-sm border border-borderpink text-inksoft hover:bg-pink-50 transition-colors"
            >
              View art gallery
            </a>
          </div>
        </div>

        {/* Right: 3D wooden bookshelf */}
        <div className="hidden lg:block">
          <Bookshelf3D />
        </div>
      </div>
    </section>
  );
}
