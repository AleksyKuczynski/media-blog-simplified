import { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/constants/constants';

const PROD_URL = 'https://event4me.vip';
const isProduction = SITE_URL === PROD_URL;

const disallowed: string[] = ['/api/', '/admin/', '/preview/'];

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