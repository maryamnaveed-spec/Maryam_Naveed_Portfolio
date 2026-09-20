'use client';

import { useState } from 'react';
import { ArtItem } from '@/lib/supabase';
import ArtGrid from './ArtGrid';

export default function CategoryFilterGridPage({
  items,
  subcategories,
  emptyLabel
}: {
  items: ArtItem[];
  subcategories: string[];
  emptyLabel: string;
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const options = ['All', ...subcategories];
  const filtered =
    activeFilter === 'All' ? items : items.filter((i) => i.subcategory === activeFilter);

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

      <ArtGrid items={filtered} emptyLabel={emptyLabel} />
    </div>
  );
}
