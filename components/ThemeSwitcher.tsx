'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';

const palettes: { name: 'pink' | 'lavender' | 'mint' | 'peach'; label: string; swatch: string }[] = [
  { name: 'pink', label: 'Baby Pink', swatch: '#F472A0' },
  { name: 'lavender', label: 'Lavender', swatch: '#9E76E0' },
  { name: 'mint', label: 'Mint', swatch: '#3EB28E' },
  { name: 'peach', label: 'Peach', swatch: '#E9854A' }
];

export default function ThemeSwitcher() {
  const { theme, setTheme, dark, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-3 w-56 bg-surface border border-borderpink rounded-2xl shadow-2xl p-4 glass-card">
          <p className="text-xs font-semibold text-inksoft mb-2 uppercase tracking-wide">
            Color theme
          </p>
          <div className="flex gap-2 mb-4">
            {palettes.map((p) => (
              <button
                key={p.name}
                onClick={() => setTheme(p.name)}
                title={p.label}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  theme === p.name ? 'border-ink scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: p.swatch }}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-inksoft mb-2 uppercase tracking-wide">
            Appearance
          </p>
          <button
            onClick={toggleDark}
            className="w-full flex items-center justify-between text-sm font-medium px-3 py-2 rounded-full border border-borderpink hover:bg-pink-50"
          >
            <span>{dark ? 'Dark mode' : 'Light mode'}</span>
            <span>{dark ? '🌙' : '☀️'}</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        aria-label="Theme settings"
        className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-pink-400/30 hover:scale-105 transition-transform"
      >
        {open ? '✕' : '🎨'}
      </button>
    </div>
  );
}
