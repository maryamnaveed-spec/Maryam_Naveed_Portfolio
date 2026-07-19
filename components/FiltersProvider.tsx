'use client';

import { createContext, useContext, useState } from 'react';

type FiltersContextValue = {
  artFilter: string;
  setArtFilter: (v: string) => void;
  calligraphyFilter: string;
  setCalligraphyFilter: (v: string) => void;
  blogFilter: string;
  setBlogFilter: (v: string) => void;
};

const FiltersContext = createContext<FiltersContextValue | null>(null);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [artFilter, setArtFilter] = useState('All');
  const [calligraphyFilter, setCalligraphyFilter] = useState('All Names');
  const [blogFilter, setBlogFilter] = useState('Latest');

  return (
    <FiltersContext.Provider
      value={{
        artFilter,
        setArtFilter,
        calligraphyFilter,
        setCalligraphyFilter,
        blogFilter,
        setBlogFilter
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside FiltersProvider');
  return ctx;
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
