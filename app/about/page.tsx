import Header from '@/components/Header';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Instant, cached navigation instead of re-fetching on every visit.
export const revalidate = 30;

export const metadata = {
  title: 'About Maryam Naveed'
};

async function getProfileImage(): Promise<string | null> {
  const { data } = await supabase
    .from('settings')
    .select('profile_image_url')
    .eq('id', 1)
    .single();
  return data?.profile_image_url ?? null;
}

export default async function AboutPage() {
  const profileImage = await getProfileImage();

  return (
    <main>
      <Header />

      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-100/60 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-goldlight/30 blur-3xl" />

        <div className="max-w-4xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-10">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-3xl shadow-xl mb-4">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt="Maryam Naveed" className="w-full h-full object-cover" />
              ) : (
                'MN'
              )}
            </div>
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              About the curator
            </span>
            <h1 className="text-4xl sm:text-5xl mb-2">Maryam Naveed</h1>
            <p className="text-inksoft font-medium">
              Librarian &middot; Artist &middot; Calligrapher &middot; Psychiatrist
            </p>
          </div>

          <div className="glass-card border border-borderpink rounded-3xl p-8 sm:p-12 card-shadow space-y-6 text-inksoft text-[15px] leading-relaxed">
            <p>
              I am a librarian, painter, and calligraphy enthusiast with a deep
              appreciation for knowledge, creativity, and human understanding.
              My journey is inspired by the belief that books expand our
              minds, art gives shape to emotions, and every individual carries
              a unique story worth discovering.
            </p>
            <p>
              Working as a librarian has strengthened my love for learning,
              while painting and calligraphy allow me to express thoughts and
              emotions beyond words. Every brushstroke and every letter I
              create reflects patience, beauty, and meaning.
            </p>
            <p>
              Alongside my creative interests, I am passionate about
              psychology and understanding the human mind. I enjoy exploring
              how people think, feel, and perceive the world, believing that
              empathy and curiosity are essential parts of both art and life.
            </p>
            <p>
              This portfolio is a collection of my artistic creations,
              calligraphy, and the books that have inspired my journey. I
              hope it encourages creativity, lifelong learning, and a deeper
              appreciation for the stories that connect us all.
            </p>
            <p className="quote text-2xl text-pink-600 leading-snug text-center pt-2">
              &ldquo;Every book tells a story. Every artwork expresses an
              emotion. Every mind holds a unique perspective&mdash;and I
              believe each deserves to be understood.&rdquo;
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <div className="glass-card border border-borderpink rounded-2xl p-6 text-center card-shadow">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-base mb-1">Librarian</h3>
              <p className="text-xs text-inksoft">Curating knowledge, one book at a time</p>
            </div>
            <div className="glass-card border border-borderpink rounded-2xl p-6 text-center card-shadow">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-base mb-1">Artist</h3>
              <p className="text-xs text-inksoft">Painting emotions onto canvas</p>
            </div>
            <div className="glass-card border border-borderpink rounded-2xl p-6 text-center card-shadow">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="text-base mb-1">Psychiatrist</h3>
              <p className="text-xs text-inksoft">Understanding minds with empathy</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#art"
              className="inline-block px-6 py-3 rounded-full font-semibold text-sm text-white bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg shadow-pink-400/25 hover:shadow-pink-400/40 transition-shadow"
            >
              Explore the portfolio
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink & canvas.
      </footer>
    </main>
  );
}
