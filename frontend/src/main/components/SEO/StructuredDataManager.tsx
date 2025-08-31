// src/main/components/SEO/StructuredDataManager.tsx
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';

interface StructuredDataManagerProps {
  dict: Dictionary;
  pageType: 'home' | 'article' | 'rubric' | 'author';
  data?: any;
}

export function StructuredDataManager({ dict, pageType, data }: StructuredDataManagerProps) {
  const generateOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://event4me.eu/#organization",
    "name": dict.seo.structuredData.organizationName,
    "description": dict.seo.structuredData.organizationDescription,
    "url": "https://event4me.eu",
    "logo": "https://event4me.eu/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": dict.seo.structuredData.contactEmail,
      "contactType": "customer support",
      "availableLanguage": ["Russian"]
    },
    "sameAs": dict.seo.structuredData.socialProfiles,
    "areaServed": dict.seo.structuredData.geographicAreas,
    "knowsLanguage": ["ru"]
  });

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://event4me.eu/#website",
    "url": "https://event4me.eu",
    "name": dict.seo.siteName,
    "description": dict.seo.descriptions.home,
    "inLanguage": "ru",
    "publisher": { "@id": "https://event4me.eu/#organization" },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://event4me.eu/ru/search?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  });

  const generateArticleSchema = (articleData: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "publisher": { "@id": "https://event4me.eu/#organization" },
    "datePublished": articleData.publishedTime,
    "dateModified": articleData.modifiedTime,
    "image": articleData.imageUrl,
    "inLanguage": "ru",
    "mainEntityOfPage": articleData.url
  });

  const schemas = [
    generateOrganizationSchema(),
    generateWebsiteSchema()
  ];

  if (pageType === 'article' && data) {
    schemas.push(generateArticleSchema(data));
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}