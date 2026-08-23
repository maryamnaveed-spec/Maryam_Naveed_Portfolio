import Reveal from './Reveal';

const cards = [
  {
    icon: '📚',
    title: 'Librarian',
    text: 'Working as a librarian has strengthened my love for learning, curating knowledge and organizing wisdom for others to discover.'
  },
  {
    icon: '🎨',
    title: 'Artist & Calligrapher',
    text: 'Painting and calligraphy let me express thoughts beyond words. Every brushstroke and every letter reflects patience, beauty, and meaning.'
  },
  {
    icon: '🧠',
    title: 'Student of the Mind',
    text: 'I am passionate about psychology — exploring how people think, feel, and perceive the world, believing empathy and curiosity go hand in hand.'
  },
  {
    icon: '✨',
    title: 'This Portfolio',
    text: 'A collection of my art, calligraphy, and the books that inspired my journey — hoping to encourage creativity and lifelong learning.'
  }
];

export default function AboutSection({ profileImage }: { profileImage?: string | null }) {
  return (
    <section className="py-16 relative overflow-hidden" id="about-story">
      <div className="pointer-events-none absolute top-10 left-1/4 w-64 h-64 rounded-full bg-pink-100/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-goldlight/20 blur-3xl" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
        <Reveal>
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center font-display font-semibold text-2xl shadow-xl mb-4">
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImage} alt="Maryam Naveed" className="w-full h-full object-cover" />
              ) : (
                'MN'
              )}
            </div>
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full mb-3">
              My story
            </span>
            <h2 className="text-3xl sm:text-4xl">A little more about me</h2>
            <p className="text-inksoft text-sm sm:text-base mt-2 max-w-xl mx-auto">
              I am a librarian, and calligraphy enthusiast with a
              deep appreciation for knowledge, creativity, and human
              understanding.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 100}>
              <div className="group relative glass-card border border-borderpink rounded-2xl p-6 card-shadow h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-pink-400/60 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-gold to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-2xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {card.icon}
                </div>
                <h3 className="text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-inksoft leading-relaxed">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div className="relative glass-card border border-borderpink rounded-2xl p-7 sm:p-9 card-shadow overflow-hidden text-center">
            <span className="pointer-events-none absolute -left-4 -top-6 text-8xl text-pink-400/10 select-none">
              &ldquo;
            </span>
            <p className="quote text-2xl sm:text-3xl text-ink leading-snug relative">
              Every book tells a story. Every artwork expresses an emotion.
              Every mind holds a unique perspective&mdash;and I believe each
              deserves to be understood.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
