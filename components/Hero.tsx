'use client';

export default function Hero({ profileImage }: { profileImage?: string | null }) {
  const photoUrl = profileImage || '/images/hero-bgf.png';

  return (
    <section className="py-10 sm:py-14 px-3 sm:px-5">
      <div className="max-w-6xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] bg-pink-50/70 p-4 sm:p-8 lg:p-12">
        <div className="bg-surface rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-pink-900/5 px-5 sm:px-10 lg:px-14 py-10 sm:py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          {/* Text */}
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.2] text-ink mb-5">
              Hello! I&rsquo;m{' '}
              <span className="relative inline-block px-1.5">
                <span className="absolute inset-x-0 bottom-1 h-[0.5em] bg-pink-200/70 -rotate-1 rounded-sm"></span>
                <span className="relative">Maryam</span>
              </span>
              , a storyteller and creator based in Pakistan.
            </h1>

            <div className="space-y-4 text-inksoft text-[15px] sm:text-base leading-relaxed mb-8 max-w-xl">
              <p>
                I find deep joy in bringing stories to life, blending my
                passions for literature and the visual arts.
              </p>
              <p>
                I am a dedicated <strong className="text-ink font-semibold">librarian and artist</strong>,
                with a love for curated knowledge and compelling narratives.
                My journey has involved managing collections, creating
                calligraphy and paintings, and finding the perfect words.
              </p>
              <p>I bring a blend of artistic vision and collaborative clarity to every piece.</p>
              <p>I am open to new opportunities and creative collaborations. Let&rsquo;s connect.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/gallery"
                className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-ink hover:bg-ink/90 shadow-md hover:-translate-y-0.5 transition-all"
              >
                View Portfolio
              </a>
              <a
                href="/gallery"
                className="px-6 py-3 rounded-full text-sm font-semibold border border-borderpink text-ink hover:bg-pink-50 transition-colors"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl shadow-pink-900/10 ring-1 ring-borderpink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Maryam Naveed"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-surface/95 backdrop-blur px-2.5 py-1.5 rounded-full shadow-md text-xs">
              <span title="Librarian">📚</span>
              <span title="Artist">🎨</span>
              <span title="Calligrapher">✒️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
