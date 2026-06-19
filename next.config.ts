import type { NextConfig } from "next";

const contentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' data: blob: https:;
  font-src 'self' data: https:;
  connect-src 'self' https: wss:;
  frame-ancestors 'none';
  form-action 'self' https://formsubmit.co;
  base-uri 'self';
  object-src 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const nextConfig: NextConfig = {
  experimental: {
    // Material + logo images are submitted through Server Actions as multipart
    // form data. Next's default Server Action body cap is 1MB, which rejects
    // anything larger with a 400 *before* the action runs (surfacing as the
    // cryptic "An unexpected response was received from the server" crash).
    // Raise it to Vercel's hard request-body ceiling (4.5MB). Files are also
    // validated against a 4MB app limit, leaving headroom for multipart overhead.
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/industries/tattoos',
        destination: '/industries',
        permanent: true,
      },
      {
        source: '/industries/tattoos/:path*',
        destination: '/industries',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
