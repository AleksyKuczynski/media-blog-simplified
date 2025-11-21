// next.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  // Explicitly set the output file tracing root to silence workspace warning
  outputFileTracingRoot: __dirname,
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '51.21.135.65',
        port: '8055',
        pathname: '/assets/**',
      },
    ],
    qualities: [75, 90]
  },
  
  transpilePackages: ['swiper'],
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'app')],
  },
  
  experimental: {
    scrollRestoration: false, // Disables Next.js scroll restoration
    optimizePackageImports: ['@tailwindcss/typography'], // Enable optimizePackageImports for better tree shaking
  },

  async headers() {
    const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://51.21.135.65:8055';
    
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