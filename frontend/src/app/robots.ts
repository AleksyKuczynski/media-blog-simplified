import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants/constants';

const PROD_URL = 'https://event4me.vip';
const isProduction = SITE_URL === PROD_URL;

// Disallow internal API endpoints and admin areas, but NOT /api/images/ (Directus assets)
const disallowed: string[] = [
  '/api/auth/',
  '/api/admin/',
  '/api/server/',
  '/admin/',
  '/preview/',
];

const allowed: string[] = [
  '/',
  '/api/images/', // Directus image asset proxy — must be explicitly allowed
];

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
      sitemap: `${SITE_URL}/sitemap.xml`,
      host: SITE_URL,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: allowed,
        disallow: disallowed,
      },
      {
        userAgent: 'Yandex',
        allow: allowed,
        disallow: disallowed,
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: allowed,
        disallow: disallowed,
      },
      {
        userAgent: 'GPTBot',
        allow: ['/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/'],
      },
      {
        userAgent: 'Applebot',
        allow: ['/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}