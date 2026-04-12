import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants/constants';

const disallowed: string[] = ['/api/', '/_next/', '/admin/', '/preview/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: disallowed,
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: disallowed,
        crawlDelay: 2,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: disallowed,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}