import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FiltersProvider } from '@/components/FiltersProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'Maryam Naveed — Curator of Mind & Art',
  description: 'Librarian, artist, calligrapher and psychiatrist — books, art and calligraphy in one place.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://mozilla.github.io" />
        <link rel="dns-prefetch" href="https://mozilla.github.io" />
      </head>
      <body>
        <ThemeProvider>
          <FiltersProvider>
            {children}
            <ThemeSwitcher />
            <CustomCursor />
          </FiltersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
