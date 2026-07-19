export default function AboutSection() {
  return (
    <section className="py-14" id="about-story">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-8">
          <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
            My story
          </div>
          <h2 className="text-3xl">A little more about me</h2>
        </div>

        <div className="bg-surface border border-borderpink rounded-card p-7 sm:p-9 card-shadow space-y-5 text-inksoft text-[15px] leading-relaxed">
          <p>
            I am a librarian, painter, and calligraphy enthusiast with a deep
            appreciation for knowledge, creativity, and human understanding.
            My journey is inspired by the belief that books expand our
            minds, art gives shape to emotions, and every individual carries
            a unique story worth discovering.
          </p>
          <p>
            Working as a librarian has strengthened my love for learning,
            while painting and calligraphy allow me to express thoughts and
            emotions beyond words. Every brushstroke and every letter I
            create reflects patience, beauty, and meaning.
          </p>
          <p>
            Alongside my creative interests, I am passionate about
            psychology and understanding the human mind. I enjoy exploring
            how people think, feel, and perceive the world, believing that
            empathy and curiosity are essential parts of both art and life.
          </p>
          <p>
            This portfolio is a collection of my artistic creations,
            calligraphy, and the books that have inspired my journey. I
            hope it encourages creativity, lifelong learning, and a deeper
            appreciation for the stories that connect us all.
          </p>
          <p className="quote text-2xl text-pink-600 leading-snug">
            Every book tells a story. Every artwork expresses an emotion.
            Every mind holds a unique perspective&mdash;and I believe each
            deserves to be understood.
          </p>
        </div>
      </div>
    </section>
  );
}
