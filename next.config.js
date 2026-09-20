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
    // even on "force-dynamic" routes, so re-visiting a page right after
    // adding/editing something in Admin could still show the old list.
    // Setting both to 0 makes every navigation fetch fresh data from the
    // server, every time.
    staleTimes: {
      dynamic: 0,
      static: 0
    }
  },
  webpack: (config) => {
    // pdfjs-dist's legacy build references the optional Node "canvas"
    // package (only needed for server-side PDF rendering, which we never
    // do - our viewer only runs in the browser). Without this, webpack
    // fails the build trying to resolve it.
    config.resolve.fallback = { ...config.resolve.fallback, canvas: false };
    return config;
  }
};

module.exports = nextConfig;
