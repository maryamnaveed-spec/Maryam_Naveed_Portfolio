const items = [
  {
    icon: '📚',
    title: 'Curated librarianship',
    text: 'Classic volumes, psychological papers and modern narratives, organized to inspire lifelong learning.'
  },
  {
    icon: '🎨',
    title: 'Visual expression',
    text: 'Blending watercolors, pens and pencils into detailed sketches of human thought and emotion.'
  },
  {
    icon: '🧠',
    title: 'Psychological musings',
    text: 'Deciphering behavior, minds and characters to encourage understanding beyond words.'
  }
];

export default function FocusCards() {
  return (
    <section className="py-14" id="about">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-8">
          <div className="text-[11px] font-semibold tracking-wide uppercase text-pink-600 mb-1">
            Maryam&apos;s expertise
          </div>
          <h2 className="text-3xl">Areas of personal focus</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.title} className="glass-card rounded-card p-6 card-shadow border border-borderpink transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-pink-400/50">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-lg mb-4">
                {item.icon}
              </div>
              <h3 className="text-base mb-2">{item.title}</h3>
              <p className="text-sm text-inksoft">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
