/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co'
      }
    ]
  },
  experimental: {
    // Next.js keeps a client-side cache of each page's data for a while
    // even on "force-dynamic" routes, so clicking Shop right after adding
    // a product in Admin could still show the old list. Setting both to 0
    // makes every navigation fetch fresh data from the server, every time.
    staleTimes: {
      dynamic: 0,
      static: 0
    }
  }
};

module.exports = nextConfig;
