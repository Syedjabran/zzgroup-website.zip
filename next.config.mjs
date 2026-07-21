/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').host; }
  catch { return undefined; }
})();

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Default is 1 MB, which rejects product-photo uploads before the
      // action runs. Form allows images up to 5 MB; 8 MB covers overhead.
      bodySizeLimit: '8mb'
    }
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : []
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    }];
  }
};
export default nextConfig;
