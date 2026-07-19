'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeName = 'pink' | 'lavender' | 'mint' | 'peach';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  dark: boolean;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('pink');
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('site-theme') as ThemeName) || 'pink';
    const savedDark = localStorage.getItem('site-dark') === 'true';
    setThemeState(savedTheme);
    setDark(savedDark);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (theme === 'pink') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    root.classList.toggle('dark', dark);
    localStorage.setItem('site-theme', theme);
    localStorage.setItem('site-dark', String(dark));
  }, [theme, dark, ready]);

  function setTheme(t: ThemeName) {
    setThemeState(t);
  }

  function toggleDark() {
    setDark((d) => !d);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
