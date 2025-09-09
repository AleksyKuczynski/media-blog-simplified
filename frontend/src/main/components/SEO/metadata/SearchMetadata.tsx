// src/main/components/SEO/metadata/SearchMetadata.tsx

import { Dictionary } from "@/main/lib/dictionary/types";
import { Metadata } from "next";

/**
 * Generate STATIC search page metadata - no dynamic content
 * Perfect for SSG where no search query exists
 */
export const generateStaticSearchMetadata = (
  dictionary: Dictionary
): Metadata => {
  const searchDict = dictionary.search;
  const seoDict = dictionary.seo;
  const baseUrl = 'https://event4me.eu';

  // Static search page data
  const title = searchDict.templates.pageTitle;
  const description = searchDict.templates.pageDescription;
  const canonicalUrl = `${baseUrl}/ru/search`;
  const keywords = `${seoDict.keywords.general}, поиск статей, поиск авторов, поиск рубрик`;
  const ogImage = `${baseUrl}/og-search.jpg`;

  return {
    title,
    description,
    keywords,
    
    // Core SEO
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: seoDict.site.siteName,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

    // Static metadata for Russian market
    other: {
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
      'google-site-verification': process.env.GOOGLE_VERIFICATION || '',
      'content-language': seoDict.regional.language,
      'geo.region': seoDict.regional.region,
      'geo.placename': seoDict.regional.geographicCoverage,
      'robots': 'index, follow, max-snippet:120, max-image-preview:standard',
      'googlebot': 'index, follow',
      
      // Dublin Core for static search page
      'DC.title': title,
      'DC.description': description,
      'DC.language': seoDict.regional.language,
      'DC.creator': seoDict.site.siteName,
      'DC.publisher': seoDict.site.siteName,
      'DC.type': 'Text.SearchPage',
      'DC.identifier': canonicalUrl,
      'DC.coverage': seoDict.regional.geographicCoverage,
      'DC.rights': 'Copyright EventForMe',
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': 120,
        'max-image-preview': 'standard',
        'max-video-preview': -1,
      },
    },
  };
};