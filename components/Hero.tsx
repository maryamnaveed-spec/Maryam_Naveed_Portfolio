'use client';

export default function Hero({ backgroundImage }: { backgroundImage?: string | null }) {
  const bgUrl = backgroundImage || '/images/hero-bgf.png';

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 w-full h-full hero-bg-img"
      />

      <style jsx>{`
        .hero-bg-img {
          object-fit: cover;
          /* On phones (portrait), keep the top ~30% of the photo in frame
             instead of a dead-center crop, so the interesting part of the
             image (whatever the admin uploads) doesn't get cut off. */
          object-position: center 25%;
        }
        @media (min-width: 640px) {
          .hero-bg-img {
            object-position: center center;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-black/10"></div>
    </section>
  );
}
