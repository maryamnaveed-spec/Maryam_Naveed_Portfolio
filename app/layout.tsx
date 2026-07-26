import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { FiltersProvider } from '@/components/FiltersProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CustomCursor from '@/components/CustomCursor';
import ChatWidget from '@/components/ChatWidget';
import PWARegister from '@/components/PWARegister';
import InstallPrompt from '@/components/InstallPrompt';

export const metadata: Metadata = {
  title: 'Maryam Naveed — Curator of Mind & Art',
  description: 'Librarian, artist, calligrapher and psychiatrist — books, art and calligraphy in one place.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Maryam Naveed'
  }
};

export const viewport: Viewport = {
  themeColor: '#D94E80',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
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
            <InstallPrompt />
            {children}
            <ThemeSwitcher />
            <CustomCursor />
            <ChatWidget />
            <PWARegister />
          </FiltersProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
