// src/app/robots.ts

import { MetadataRoute } from 'next';

const SITE_URL = process.env.SITE_URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/_next/*',
          '/admin/*',
          '/*.json$',
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}