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
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? 'page-turn-in' : 'page-turn-init'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      <style jsx>{`
        .page-turn-init {
          opacity: 0;
          transform: perspective(1400px) rotateY(-6deg) translateX(-18px);
          transform-origin: left center;
        }
        .page-turn-in {
          animation: pageTurnIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: left center;
        }
        @keyframes pageTurnIn {
          0% {
            opacity: 0;
            transform: perspective(1400px) rotateY(-10deg) translateX(-24px);
          }
          100% {
            opacity: 1;
            transform: perspective(1400px) rotateY(0deg) translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-turn-init {
            opacity: 1;
            transform: none;
          }
          .page-turn-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
