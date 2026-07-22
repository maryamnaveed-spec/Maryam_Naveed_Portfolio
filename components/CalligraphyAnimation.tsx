'use client';

export default function CalligraphyAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 240 320"
        className="w-full max-w-[220px] h-auto"
        fill="none"
      >
        {/* Faint guide line */}
        <line x1="30" y1="160" x2="210" y2="160" stroke="rgb(var(--borderpink))" strokeWidth="1" strokeDasharray="2 4" />

        {/* Animated flowing calligraphy stroke */}
        <path
          d="M40 210 C 60 120, 90 260, 110 150 S 150 80, 170 190 S 200 240, 205 140"
          stroke="rgb(var(--pink-600))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="calligraphy-path"
        />

        {/* Pen nib tip that travels along the stroke */}
        <circle r="5" fill="rgb(var(--gold))" className="calligraphy-nib">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M40 210 C 60 120, 90 260, 110 150 S 150 80, 170 190 S 200 240, 205 140"
          />
        </circle>

        {/* Ink droplet accents */}
        <circle cx="55" cy="235" r="2.5" fill="rgb(var(--pink-400))" opacity="0.5" />
        <circle cx="185" cy="245" r="2" fill="rgb(var(--gold))" opacity="0.5" />
      </svg>

      <style jsx global>{`
        .calligraphy-path {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawStroke 3.2s ease-in-out infinite;
        }
        @keyframes drawStroke {
          0% { stroke-dashoffset: 400; opacity: 0.3; }
          10% { opacity: 1; }
          60% { stroke-dashoffset: 0; opacity: 1; }
          85% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -400; opacity: 0.3; }
        }
        .calligraphy-nib {
          filter: drop-shadow(0 0 4px rgba(201, 154, 68, 0.7));
        }
      `}</style>
    </div>
  );
}
