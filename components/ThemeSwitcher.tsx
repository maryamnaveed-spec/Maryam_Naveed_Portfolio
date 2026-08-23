'use client';

import { useState } from 'react';
import { useTheme, ThemeName } from './ThemeProvider';

const palettes: { name: ThemeName; label: string; swatch: string }[] = [
  { name: 'pink', label: 'Baby Pink', swatch: '#F472A0' },
  { name: 'rose', label: 'Rose', swatch: '#dd5f74' },
  { name: 'crimson', label: 'Crimson', swatch: '#dd5f7f' },
  { name: 'coral', label: 'Coral', swatch: '#dd705f' },
  { name: 'terracotta', label: 'Terracotta', swatch: '#dd855f' },
  { name: 'peach', label: 'Peach', swatch: '#E9854A' },
  { name: 'amber', label: 'Amber', swatch: '#ddaf5f' },
  { name: 'gold', label: 'Gold', swatch: '#ddbe5f' },
  { name: 'olive', label: 'Olive', swatch: '#ccdd5f' },
  { name: 'lime', label: 'Lime', swatch: '#a2dd5f' },
  { name: 'mint', label: 'Mint', swatch: '#3EB28E' },
  { name: 'emerald', label: 'Emerald', swatch: '#5fdda2' },
  { name: 'teal', label: 'Teal', swatch: '#5fddd3' },
  { name: 'cyan', label: 'Cyan', swatch: '#5fc8dd' },
  { name: 'sky', label: 'Sky', swatch: '#5fb3dd' },
  { name: 'azure', label: 'Azure', swatch: '#5f9edd' },
  { name: 'sapphire', label: 'Sapphire', swatch: '#5f85dd' },
  { name: 'indigo', label: 'Indigo', swatch: '#655fdd' },
  { name: 'lavender', label: 'Lavender', swatch: '#9E76E0' },
  { name: 'violet', label: 'Violet', swatch: '#945fdd' },
  { name: 'plum', label: 'Plum', swatch: '#be5fdd' },
  { name: 'magenta', label: 'Magenta', swatch: '#dd5fd3' },
  { name: 'fuchsia', label: 'Fuchsia', swatch: '#dd5fb3' },
  { name: 'slate', label: 'Slate', swatch: '#8d9bb0' }
];

export default function ThemeSwitcher() {
  const { theme, setTheme, dark, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-3 w-72 bg-surface border border-borderpink rounded-2xl shadow-2xl p-4 glass-card">
          <p className="text-xs font-semibold text-inksoft mb-2 uppercase tracking-wide">
            Color theme · {palettes.length} options
          </p>
          <div className="grid grid-cols-6 gap-2 mb-4 max-h-40 overflow-y-auto pr-1">
            {palettes.map((p) => (
              <button
                key={p.name}
                onClick={() => setTheme(p.name)}
                title={p.label}
                aria-label={p.label}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  theme === p.name ? 'border-ink scale-110 ring-2 ring-offset-1 ring-ink/30' : 'border-white/60'
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
