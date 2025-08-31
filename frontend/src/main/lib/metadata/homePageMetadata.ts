// src/main/lib/metadata/homePageMetadata.ts - Separated code from presentation
import { Metadata } from 'next';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';

/**
 * Generates comprehensive metadata for the home page
 * Optimized for Google and Yandex search engines
 */
export async function generateHomePageMetadata(): Promise<Metadata> {
  const dict = await getDictionary('ru');
  
  return {
    title: dict.seo.titles.homePrefix,
    description: dict.seo.descriptions.home,
    keywords: dict.seo.keywords.general,
    
    // Open Graph optimization for social sharing
    openGraph: {
      title: dict.seo.titles.homePrefix,
      description: dict.seo.descriptions.home,
      url: 'https://event4me.eu/ru',
      siteName: dict.seo.siteName,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: 'https://event4me.eu/og-home.jpg',
          width: 1200,
          height: 630,
          alt: dict.sections.home.welcomeTitle,
        },
      ],
    },
    
    // Twitter Card optimization
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.titles.homePrefix,
      description: dict.seo.descriptions.home,
      images: ['https://event4me.eu/og-home.jpg'],
    },

    // Additional SEO enhancements
    alternates: {
      canonical: 'https://event4me.eu/ru',
    },
    
    // Yandex-specific optimizations
    other: {
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
    },
  };
}

/**
 * Prepares schema data for the home page
 * @param heroSlugs Featured article slugs
 * @param rubrics Available rubrics
 * @returns Schema data object
 */
export async function prepareHomePageSchemaData(heroSlugs: any[], rubrics: any[]) {
  const dict = await getDictionary('ru');
  
  return {
    site: {
      name: dict.seo.siteName,
      url: 'https://event4me.eu',
      description: dict.seo.descriptions.home,
    },
    articles: {
      featured: heroSlugs,
      latest: [],
    },
    rubrics: rubrics,
  };
}