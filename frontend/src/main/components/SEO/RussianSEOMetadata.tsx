// src/main/components/SEO/RussianSEOMetadata.tsx - Enhanced for Google & Yandex
import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';

interface RussianSEOMetadataProps {
  dict: Dictionary;
  title?: string;
  description?: string;
  keywords?: string;
  path?: string;
  imageUrl?: string;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

// Safe date validation function (same as in StructuredDataManager)
function validateAndFormatDate(
  dateString: string | null | undefined, 
  fallbackDate: string
): string {
  if (!dateString) return fallbackDate;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date provided: ${dateString}, using fallback`);
    return fallbackDate;
  }
  
  return date.toISOString();
}

// Enhanced metadata generation optimized for Russian market
export function generateRussianSEOMetadata({
  dict,
  title,
  description,
  keywords,
  path = '',
  imageUrl = 'https://event4me.eu/og-home.jpg',
  articleData
}: RussianSEOMetadataProps): Metadata {
  const siteUrl = 'https://event4me.eu';
  const fullUrl = `${siteUrl}/ru${path}`;
  
  const finalTitle = title || dict.seo.titles.homePrefix;
  const finalDescription = description || dict.seo.descriptions.home;
  const finalKeywords = keywords || dict.seo.keywords.general;

  const safeArticleData = articleData ? {
    ...articleData,
    publishedTime: validateAndFormatDate(
      articleData.publishedTime, 
      new Date().toISOString()
    ),
    modifiedTime: validateAndFormatDate(
      articleData.modifiedTime, 
      articleData.publishedTime || new Date().toISOString()
    )
  } : undefined;

  return {
    // Basic metadata optimized for Russian search engines
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    
    // Language and locale for Russian market
    alternates: {
      canonical: fullUrl,
      languages: {
        'ru': fullUrl,
        'x-default': fullUrl
      }
    },

    // Enhanced Open Graph for Russian social networks
    openGraph: {
      type: articleData ? 'article' : 'website',
      locale: 'ru_RU',
      alternateLocale: ['en_US'],
      url: fullUrl,
      siteName: dict.seo.siteName,
      title: finalTitle,
      description: finalDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle,
        }
      ],
      // Article-specific OG data with validated dates
      ...(safeArticleData && {
        publishedTime: safeArticleData.publishedTime,
        modifiedTime: safeArticleData.modifiedTime,
        authors: safeArticleData.author ? [safeArticleData.author] : undefined,
        section: safeArticleData.section,
        tags: safeArticleData.tags
      })
    },

    // Twitter/X optimization
    twitter: {
      card: 'summary_large_image',
      site: '@eventforme_eu',
      creator: '@eventforme_eu',
      title: finalTitle,
      description: finalDescription,
      images: [imageUrl]
    },

    // Additional metadata for Yandex
    other: {
      // Yandex-specific meta tags
      'yandex-verification': process.env.YANDEX_VERIFICATION_CODE || '',
      'yandex-zen-verification': process.env.YANDEX_ZEN_VERIFICATION_CODE || '',
      'yandex:card': 'summary_large_image',
      'yandex:title': finalTitle,
      'yandex:description': finalDescription,
      'yandex:image': imageUrl,
      
      // Russian social media optimization
      'vk:card': 'summary_large_image',
      'vk:title': finalTitle,
      'vk:description': finalDescription,
      'vk:image': imageUrl,
      
      // Telegram optimization for Russian audience
      'telegram:card': 'summary_large_image',
      'telegram:title': finalTitle,
      'telegram:description': finalDescription,
      'telegram:image': imageUrl,
      
      // Content classification for Russian search engines
      'classification': 'Культура, Развлечения, Медиа',
      'category': 'Культура и развлечения',
      'coverage': 'Russia, Europe',
      'distribution': 'Global',
      'rating': 'General',
      'audience': 'Adults',
      'topic': 'Culture, Events, Music',
      
      // Enhanced mobile optimization
      'viewport': 'width=device-width, initial-scale=1.0, viewport-fit=cover',
      'mobile-web-app-capable': 'yes',
      'mobile-web-app-status-bar-style': 'default',
      'mobile-web-app-title': dict.seo.siteName,
      
      // Performance and caching hints
      'theme-color': '#6366f1',
      'msapplication-TileColor': '#6366f1',
      'msapplication-navbutton-color': '#6366f1',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-title': dict.seo.siteName,
      
      // Geo-targeting for Russian market
      'geo.region': 'RU',
      'geo.placename': 'Russia',
      'ICBM': '55.7558, 37.6176', // Moscow coordinates for Russian targeting
      
      // Content freshness signals
      'revisit-after': '7 days',
      'expires': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      'last-modified': new Date().toISOString(),
      
      // Enhanced semantic metadata
      'application-name': dict.seo.siteName,
      'msapplication-tooltip': finalDescription,
      'msapplication-starturl': fullUrl,
      'msapplication-window': 'width=1024;height=768',
      'msapplication-task': `name=Главная;action-uri=${siteUrl}/ru;icon-uri=${siteUrl}/favicon.ico`
    },

    // Enhanced robots configuration
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      }
    },

    // Enhanced app metadata
    applicationName: dict.seo.siteName,
    appleWebApp: {
      capable: true,
      title: dict.seo.siteName,
      statusBarStyle: 'default'
    },

    // Verification codes for Russian search engines
    verification: {
      google: process.env.GOOGLE_VERIFICATION_CODE,
      yandex: process.env.YANDEX_VERIFICATION_CODE
    }
  };
}

// React component for additional structured data
export function RussianSEOStructuredData({ 
  dict, 
  path = '', 
  articleData 
}: Pick<RussianSEOMetadataProps, 'dict' | 'path' | 'articleData'>) {
  const siteUrl = 'https://event4me.eu';

  const safeArticleData = articleData ? {
    ...articleData,
    publishedTime: validateAndFormatDate(
      articleData.publishedTime, 
      new Date().toISOString()
    ),
    modifiedTime: validateAndFormatDate(
      articleData.modifiedTime, 
      articleData.publishedTime || new Date().toISOString()
    )
  } : undefined;

  // Organization schema for Russian market
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    "name": dict.seo.siteName,
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/logo.png`,
      "width": 200,
      "height": 60
    },
    "sameAs": [
      "https://t.me/eventforme",
      "https://vk.com/eventforme",
      "https://twitter.com/eventforme_eu"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@event4me.eu",
      "contactType": "customer support",
      "availableLanguage": ["Russian", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EU",
      "addressRegion": "Europe"
    },
    "areaServed": ["RU", "BY", "KZ", "UA", "EU"],
    "knowsLanguage": ["ru", "en"]
  };

  // Website schema with enhanced Russian focus
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": dict.seo.siteName,
    "description": dict.seo.descriptions.home,
    "inLanguage": "ru",
    "publisher": {
      "@id": `${siteUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/ru/search?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "audience": {
      "@type": "Audience",
      "geographicArea": ["Russia", "Belarus", "Kazakhstan", "Ukraine"]
    }
  };

  // Breadcrumb schema for navigation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": `${siteUrl}/ru`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
    </>
  );
}