'use client';

import { ArtItem } from '@/lib/supabase';
import ArtGrid from './ArtGrid';

export default function CategoryFilterGrid({
  items,
  subcategories,
  activeFilter,
  onFilterChange,
  emptyLabel
}: {
  items: ArtItem[];
  subcategories: string[];
  activeFilter: string;
  onFilterChange: (v: string) => void;
  emptyLabel: string;
}) {
  const options = ['All', ...subcategories];
  const filtered =
    activeFilter === 'All' ? items : items.filter((i) => i.subcategory === activeFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-7">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onFilterChange(opt)}
            className={`text-xs sm:text-[13px] font-semibold px-4 py-2 rounded-full border transition-colors ${
              activeFilter === opt
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white border-transparent shadow-md shadow-pink-400/25'
                : 'border-borderpink text-inksoft hover:bg-pink-50'
            }`}
          >
            {opt.toUpperCase()}
          </button>
        ))}
      </div>
      <ArtGrid items={filtered} emptyLabel={emptyLabel} />
    </div>
  );
}
