import type { CapacitorConfig } from '@capacitor/cli';

// This app is a server-rendered Next.js site (dynamic Supabase data, ISR,
// admin auth, etc.) - a full "static export" build would break most of
// that. Instead, Capacitor is set up in "remote URL" mode: the native
// app is a thin, real native shell (its own icon, splash screen, status
// bar, and eventually push notifications / native APIs) that loads your
// already-deployed website inside it.
//
// Practical effect: publishing new content or code changes to Vercel
// updates the app instantly for everyone, with no app-store rebuild
// needed. You only need to rebuild the native app when changing things
// like the app icon, splash screen, or native permissions.
//
// >>> IMPORTANT: change `server.url` below if your Vercel domain ever
// changes (e.g. after adding a custom domain). <<<

const config: CapacitorConfig = {
  appId: 'com.maryamnaveed.portfolio',
  appName: 'Maryam Naveed',
  webDir: 'public',
  server: {
    url: 'https://maryam-naveed-portfolio-v1.vercel.app',
    androidScheme: 'https',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#FFF6F9',
      showSpinner: false,
      androidSplashResourceName: 'splash'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFF6F9'
    }
  }
};

export default config;
