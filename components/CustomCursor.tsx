'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const quillRef = useRef<HTMLDivElement>(null);
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
    let lastX = 0;
    let angle = -35;

    function handleMove(e: MouseEvent) {
      const dx = e.clientX - lastX;
      if (Math.abs(dx) > 1) {
        angle = dx > 0 ? -20 : -50;
      }
      lastX = e.clientX;
      targetX = e.clientX;
      targetY = e.clientY;
      if (quillRef.current) {
        quillRef.current.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${angle}deg)`;
      }
    }

    function handleDown() {
      setPointerActive(true);
    }
    function handleUp() {
      setPointerActive(false);
    }

    function animateGlow() {
      glowX += (targetX - glowX) * 0.16;
      glowY += (targetY - glowY) * 0.16;
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
      {/* Soft trailing golden glow, like ink catching the light */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200"
        style={{
          width: pointerActive ? 26 : 34,
          height: pointerActive ? 26 : 34
        }}
      >
        <div className="w-full h-full rounded-full cursor-glow" />
      </div>

      {/* Quill nib that tracks the cursor exactly and tilts with movement */}
      <div
        ref={quillRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          className={`transition-transform duration-150 ${pointerActive ? 'scale-90' : 'scale-100'}`}
          style={{ filter: 'drop-shadow(0 0 4px rgba(201,154,68,0.85)) drop-shadow(0 1px 2px rgba(0,0,0,0.35))' }}
        >
          <path
            d="M4 22 C 4 22, 9 20, 12 15 C 16 8, 21 4, 24 2 C 21 6, 18 12, 13 15.5 C 9 18.5, 4 22, 4 22 Z"
            fill="rgb(217,78,128)"
            stroke="rgb(201,154,68)"
            strokeWidth="1"
          />
          <line x1="6" y1="20" x2="10.5" y2="15.5" stroke="rgb(201,154,68)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="24" cy="2" r="1.4" fill="rgb(241,223,184)" className="cursor-tip-shine" />
        </svg>
      </div>

      <style jsx global>{`
        @media (pointer: fine) {
          body, a, button, [role='button'] {
            cursor: none;
          }
        }
        .cursor-glow {
          background: radial-gradient(circle, rgba(201,154,68,0.35) 0%, rgba(244,114,160,0.18) 55%, transparent 75%);
          animation: cursorShine 1.8s ease-in-out infinite;
        }
        @keyframes cursorShine {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .cursor-tip-shine {
          animation: tipSparkle 1.2s ease-in-out infinite;
        }
        @keyframes tipSparkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
