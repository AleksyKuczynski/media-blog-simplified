// next.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'standalone', 
   
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.event4me.vip',
        port: '',
        pathname: '/assets/**',
      },
      {
        // Internal Docker network hostname — used when NEXT_PUBLIC_DIRECTUS_URL is not set at build time
        protocol: 'http',
        hostname: 'directus',
        port: '8055',
        pathname: '/assets/**',
      },
    ],
    formats: ['image/webp'],
    qualities: [75, 90]
  },
  
  transpilePackages: ['swiper'],
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'app')],
  },
  
  experimental: {
    optimizePackageImports: ['@tailwindcss/typography'], // Enable optimizePackageImports for better tree shaking
  },

  async headers() {
    const DIRECTUS_URL = process.env.DIRECTUS_URL || 'cms.event4me.vip';
    
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${DIRECTUS_URL}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;