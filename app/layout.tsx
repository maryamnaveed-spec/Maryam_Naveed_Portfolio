import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FiltersProvider } from '@/components/FiltersProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Maryam Naveed — Curator of Mind & Art',
  description: 'Librarian, artist, calligrapher and psychiatrist — books, art and calligraphy in one place.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FiltersProvider>
            {children}
            <ThemeSwitcher />
          </FiltersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
