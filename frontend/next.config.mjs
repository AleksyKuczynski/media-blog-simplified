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
  },
  
  transpilePackages: ['swiper'],
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'app')],
  },
  
  experimental: {
    scrollRestoration: false, // Disables Next.js scroll restoration
    optimizePackageImports: ['@tailwindcss/typography'], // Enable optimizePackageImports for better tree shaking
  },
};

export default nextConfig;