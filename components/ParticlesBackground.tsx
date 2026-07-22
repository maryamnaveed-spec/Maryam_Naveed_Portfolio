'use client';

export default function ParticlesBackground() {
  const dots = Array.from({ length: 18 }).map((_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    size: 2 + (i % 3),
    delay: (i % 6) * 0.7,
    duration: 6 + (i % 5)
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-pink-400/30 particle-float"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`
          }}
        />
      ))}

      {/* Soft floating ink blobs */}
      <div className="absolute top-1/4 left-[8%] w-40 h-40 rounded-full bg-pink-400/10 blur-3xl ink-drift" />
      <div
        className="absolute bottom-1/4 right-[10%] w-52 h-52 rounded-full bg-goldlight/20 blur-3xl ink-drift"
        style={{ animationDelay: '2.5s' }}
      />

      <style jsx global>{`
        .particle-float {
          animation-name: particleFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-18px) translateX(6px); opacity: 0.8; }
        }
        .ink-drift {
          animation: inkDrift 9s ease-in-out infinite;
        }
        @keyframes inkDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10px, -14px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
