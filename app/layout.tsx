import type { Metadata, Viewport } from 'next';
import { Inter, Cormorant_Garamond, Playfair_Display, Caveat } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import CustomCursor from '@/components/CustomCursor';
import ChatWidget from '@/components/ChatWidget';
import PWARegister from '@/components/PWARegister';
import InstallPrompt from '@/components/InstallPrompt';

// Self-hosted via next/font: fonts are fetched at build time and served
// from our own domain, with the right @font-face + font-display: swap
// generated automatically. This replaces a render-blocking @import of
// Google Fonts (which forced the browser through two extra round-trips -
// fonts.googleapis.com, then fonts.gstatic.com - before text could even
// paint), so the page now shows text immediately using a fallback font
// and swaps in the real one the moment it's ready, no more, no less.
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap'
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap'
});
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat', display: 'swap' });

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${cormorant.variable} ${playfair.variable} ${caveat.variable}`}>
      <head>
        <link rel="preconnect" href="https://mozilla.github.io" />
        <link rel="dns-prefetch" href="https://mozilla.github.io" />
      </head>
      <body>
        <ThemeProvider>
          <InstallPrompt />
          {children}
          <ThemeSwitcher />
          <CustomCursor />
          <ChatWidget />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
