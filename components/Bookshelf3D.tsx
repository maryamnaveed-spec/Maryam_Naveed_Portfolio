'use client';

const shelfBooks = [
  ['#D94E80', '#F472A0', '#C99A44', '#8A4A66', '#F1DFB8'],
  ['#C99A44', '#8A4A66', '#F472A0', '#D94E80', '#6E4E63'],
  ['#8A4A66', '#F1DFB8', '#D94E80', '#C99A44', '#F472A0']
];

export default function Bookshelf3D() {
  return (
    <div
      className="relative w-full max-w-[240px] mx-auto select-none shelf-sway"
      style={{ perspective: '900px' }}
    >
      <div
        className="rounded-xl overflow-hidden shadow-2xl shadow-ink/30"
        style={{
          transform: 'rotateY(-14deg) rotateX(4deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(160deg, #7A4A32, #4A2E1E)'
        }}
      >
        {shelfBooks.map((row, r) => (
          <div
            key={r}
            className="flex items-end gap-1.5 px-3 py-2 border-b-4"
            style={{ borderColor: 'rgba(0,0,0,0.25)' }}
          >
            {row.map((color, i) => {
              const heights = [46, 58, 40, 62, 50];
              const h = heights[i % heights.length];
              return (
                <div
                  key={i}
                  className="rounded-[2px] shelf-book"
                  style={{
                    width: '15px',
                    height: `${h}px`,
                    background: color,
                    boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.25)',
                    animationDelay: `${(r * 5 + i) * 0.15}s`,
                    transformOrigin: 'bottom center'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* A little floating book that gently orbits above the shelf */}
      <div className="absolute -top-6 right-2 w-6 h-8 rounded-sm floating-book" style={{ background: '#F472A0' }} />

      <style jsx global>{`
        .shelf-book {
          animation: shelfBounce 3.5s ease-in-out infinite;
        }
        @keyframes shelfBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(-1.5deg); }
        }
        .shelf-sway {
          animation: shelfSway 7s ease-in-out infinite;
        }
        @keyframes shelfSway {
          0%, 100% { transform: rotateZ(0deg) translateY(0); }
          50% { transform: rotateZ(0.6deg) translateY(-3px); }
        }
        .floating-book {
          animation: floatBook 4.5s ease-in-out infinite;
          box-shadow: 0 6px 14px rgba(0,0,0,0.25);
        }
        @keyframes floatBook {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
      `}</style>
    </div>
  );
}
