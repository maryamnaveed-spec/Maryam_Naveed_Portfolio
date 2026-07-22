import Header from '@/components/Header';
import FullQuranSection from '@/components/recite/FullQuranSection';

export const metadata = {
  title: 'Recite — Holy Quran'
};

export default function RecitePage() {
  return (
    <main>
      <Header />

      <section className="relative overflow-hidden py-10 sm:py-14">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-pink-100/60 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 w-72 h-72 rounded-full bg-goldlight/30 blur-3xl" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              Recite & reflect
            </span>
            <h1 className="text-3xl sm:text-5xl mb-2">Holy Quran</h1>
            <p className="text-inksoft text-sm sm:text-base">
              Read with Urdu translation, listen to recitation by Qari Abdul Basit
            </p>
          </div>

          <FullQuranSection />
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-inksoft">
        © 2026 Maryam Naveed — Curator of mind, ink & canvas.
      </footer>
    </main>
  );
}
