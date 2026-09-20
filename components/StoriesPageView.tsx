'use client';

import { useState } from 'react';
import { StoryItem } from '@/lib/supabase';
import StoryGrid from './StoryGrid';

export default function StoriesPageView({
  stories,
  categories
}: {
  stories: StoryItem[];
  categories: string[];
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const options = ['All', ...categories];
  const filtered =
    activeFilter === 'All' ? stories : stories.filter((s) => s.category === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-7 justify-center">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setActiveFilter(opt)}
            className={`text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
              activeFilter === opt
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white border-transparent shadow-sm'
                : 'border-borderpink text-inksoft hover:bg-pink-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <StoryGrid stories={filtered} />
    </div>
  );
}
