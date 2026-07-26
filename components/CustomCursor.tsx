'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Restores the normal OS mouse pointer (no custom shape), and adds a soft
 * trailing glow behind it that automatically re-colors itself to match
 * whichever site theme (pink / lavender / mint / peach) and dark/light
 * mode is currently active, via the same CSS variables the rest of the
 * site uses (--pink-600 / --gold).
 */
export default function CustomCursor() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    setEnabled(true);

    let glowX = 0;
    let glowY = 0;
    let targetX = 0;
    let targetY = 0;

    function handleMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function handleDown() {
      setPointerActive(true);
    }
    function handleUp() {
      setPointerActive(false);
    }

    function animateGlow() {
      glowX += (targetX - glowX) * 0.18;
      glowY += (targetY - glowY) * 0.18;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX}px, ${glowY}px)`;
      }
      requestAnimationFrame(animateGlow);
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    const raf = requestAnimationFrame(animateGlow);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Soft trailing glow that follows the normal OS cursor and takes on
          the active theme's colors automatically */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200"
        style={{
          width: pointerActive ? 22 : 30,
          height: pointerActive ? 22 : 30
        }}
      >
        <div className="w-full h-full rounded-full theme-cursor-glow" />
      </div>

      <style jsx global>{`
        /* Keep the normal, native mouse pointer everywhere */
        body,
        a,
        button,
        [role='button'] {
          cursor: auto;
        }
        a,
        button,
        [role='button'],
        input[type='submit'],
        input[type='button'] {
          cursor: pointer;
        }

        .theme-cursor-glow {
          background: radial-gradient(
            circle,
            rgb(var(--pink-600) / 0.32) 0%,
            rgb(var(--gold) / 0.22) 55%,
            transparent 75%
          );
          animation: themeCursorPulse 1.8s ease-in-out infinite;
        }
        @keyframes themeCursorPulse {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.15);
          }
        }
      `}</style>
    </>
  );
}
