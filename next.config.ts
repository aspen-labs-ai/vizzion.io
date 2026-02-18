import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
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
