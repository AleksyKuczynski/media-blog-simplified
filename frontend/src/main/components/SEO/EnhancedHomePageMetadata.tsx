// src/main/components/SEO/EnhancedHomePageMetadata.tsx
import { getDictionary } from '@/main/lib/dictionaries';

interface EnhancedHomePageMetadataProps {
  additionalKeywords?: string;
}

export async function EnhancedHomePageMetadata({ additionalKeywords }: EnhancedHomePageMetadataProps = {}) {
  const dict = await getDictionary('ru');
  
  const keywords = additionalKeywords 
    ? `${dict.seo.keywords.general}, ${additionalKeywords}`
    : dict.seo.keywords.general;

  return (
    <>
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Language and Region Optimization */}
      <meta httpEquiv="content-language" content="ru" />
      <meta name="geo.region" content="RU" />
      <meta name="geo.placename" content="Russia" />
      
      {/* Yandex-specific optimizations */}
      <meta name="yandex-verification" content={process.env.YANDEX_VERIFICATION || ''} />
      <meta name="msvalidate.01" content={process.env.BING_VERIFICATION || ''} />
      
      {/* Enhanced Dublin Core metadata for better semantic understanding */}
      <meta name="DC.title" content={dict.seo.titles.homePrefix} />
      <meta name="DC.description" content={dict.seo.descriptions.home} />
      <meta name="DC.language" content="ru" />
      <meta name="DC.creator" content={dict.seo.siteName} />
      <meta name="DC.publisher" content={dict.seo.siteName} />
      <meta name="DC.type" content="Text.Homepage" />
      <meta name="DC.format" content="text/html" />
      <meta name="DC.identifier" content="https://event4me.eu/ru" />
      <meta name="DC.coverage" content="Russia" />
      <meta name="DC.rights" content="Copyright EventForMe" />
      
      {/* Article-specific metadata for better content understanding */}
      <meta property="article:publisher" content="https://event4me.eu" />
      <meta property="article:author" content="EventForMe Editorial Team" />
      <meta property="article:section" content="Главная" />
      <meta property="article:tag" content={keywords} />
      
      {/* Schema.org microdata attributes for better structured content */}
      <meta itemProp="name" content={dict.seo.titles.homePrefix} />
      <meta itemProp="description" content={dict.seo.descriptions.home} />
      <meta itemProp="image" content="https://event4me.eu/og-home.jpg" />
      
      {/* Additional Open Graph properties for Russian social networks */}
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      <meta property="og:see_also" content="https://event4me.eu/ru/articles" />
      <meta property="og:see_also" content="https://event4me.eu/ru/rubrics" />
      <meta property="og:see_also" content="https://event4me.eu/ru/authors" />
      
      {/* Russian-specific social media meta tags */}
      <meta name="vk:card" content="summary_large_image" />
      <meta name="vk:title" content={dict.seo.titles.homePrefix} />
      <meta name="vk:description" content={dict.seo.descriptions.home} />
      <meta name="vk:image" content="https://event4me.eu/og-home.jpg" />
      
      {/* Telegram meta tags for Russian audience */}
      <meta name="telegram:card" content="summary_large_image" />
      <meta name="telegram:title" content={dict.seo.titles.homePrefix} />
      <meta name="telegram:description" content={dict.seo.descriptions.home} />
      <meta name="telegram:image" content="https://event4me.eu/og-home.jpg" />
      
      {/* Content classification for Russian search engines */}
      <meta name="classification" content="Культура, Развлечения, Медиа" />
      <meta name="category" content="Культура и развлечения" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta name="rating" content="General" />
      
      {/* Enhanced mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={dict.seo.siteName} />
      
      {/* Preconnect to important domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://mc.yandex.ru" />
      
      {/* Alternative language versions */}
      <link rel="alternate" hrefLang="ru" href="https://event4me.eu/ru" />
      <link rel="alternate" hrefLang="x-default" href="https://event4me.eu/ru" />
      
      {/* RSS feed for content discovery */}
      <link rel="alternate" type="application/rss+xml" title={`${dict.seo.siteName} RSS`} href="https://event4me.eu/rss.xml" />
      
      {/* Favicon and app icons optimized for different platforms */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Search engine specific directives */}
      <meta name="revisit-after" content="7 days" />
      <meta name="expires" content="never" />
      
      {/* Copyright and ownership information */}
      <meta name="author" content="EventForMe Editorial Team" />
      <meta name="publisher" content="EventForMe" />
      <meta name="copyright" content="© 2025 EventForMe. Все права защищены." />
      
      {/* Performance hints */}
      <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
      
      {/* Structured data breadcrumb hint */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": "https://event4me.eu/ru"
              }
            ]
          })
        }}
      />
    </>
  );
}