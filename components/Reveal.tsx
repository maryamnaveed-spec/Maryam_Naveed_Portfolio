'use client';

import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    // Safety net: if IntersectionObserver never fires for any reason on
    // some device/browser, don't leave the content permanently invisible.
    const fallback = setTimeout(() => setVisible(true), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? 'reveal-in' : 'reveal-init'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      <style jsx>{`
        .reveal-init {
          opacity: 0;
          transform: translateY(20px);
        }
        .reveal-in {
          animation: revealIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes revealIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-init {
            opacity: 1;
            transform: none;
          }
          .reveal-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
