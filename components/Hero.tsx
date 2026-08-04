'use client';

import Image from 'next/image';

export default function Hero({ backgroundImage }: { backgroundImage?: string | null }) {
  const bgUrl = backgroundImage || '/images/hero-bgf.png';

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Background photo (default, or whatever the admin uploaded). Uses
          next/image for fast, optimized loading, and a responsive focal
          point so mobile portrait screens don't get an awkward crop. */}
      <Image
        src={bgUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-bg-img"
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
