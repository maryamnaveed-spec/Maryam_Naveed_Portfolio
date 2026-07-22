'use client';

import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;

    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function Counter({
  icon,
  target,
  suffix,
  label,
  active,
  decimals = 0
}: {
  icon: string;
  target: number;
  suffix: string;
  label: string;
  active: boolean;
  decimals?: number;
}) {
  const value = useCountUp(target, active);
  const display =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString('en-US');

  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-3xl sm:text-4xl font-display font-semibold text-pink-600">
        {display}
        {suffix}
      </div>
      <p className="text-xs sm:text-sm text-inksoft mt-1">{label}</p>
    </div>
  );
}

export default function AnimatedCounters({
  artworkCount,
  bookCount,
  averageRating,
  visitorCount = 5000
}: {
  artworkCount: number;
  bookCount: number;
  averageRating: number;
  visitorCount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="glass-card border border-borderpink rounded-3xl px-6 py-8 sm:px-10 sm:py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 card-shadow"
    >
      <Counter icon="🎨" target={artworkCount} suffix="" label="Artworks" active={active} />
      <Counter icon="📚" target={bookCount} suffix="" label="Total Books" active={active} />
      <Counter icon="⭐" target={averageRating} suffix="" label="Average Rating" active={active} decimals={1} />
      <Counter icon="❤️" target={visitorCount} suffix="+" label="Visitors" active={active} />
    </div>
  );
}
