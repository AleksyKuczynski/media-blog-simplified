// src/main/components/SEO/StructuredDataManager.tsx - Fixed TypeScript Issues
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';

interface StructuredDataManagerProps {
  dict: Dictionary;
  pageType: 'home' | 'article' | 'rubric' | 'author';
  data?: any;
}

// ✅ FIXED: Proper type definitions for schema objects
type BaseSchema = {
  "@context": "https://schema.org";
  [key: string]: any;
};

type OrganizationSchema = BaseSchema & {
  "@type": "Organization";
  "@id": string;
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    "@type": "ContactPoint";
    email: string;
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  areaServed: string[];
  knowsLanguage: string[];
};

type WebsiteSchema = BaseSchema & {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  description: string;
  inLanguage: string;
  publisher: { "@id": string };
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
};

type ArticleSchema = BaseSchema & {
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: { "@id": string };
  datePublished: string;
  dateModified: string;
  image: string;
  inLanguage: string;
  mainEntityOfPage: string;
};

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

export function StructuredDataManager({ dict, pageType, data }: StructuredDataManagerProps) {
  const generateOrganizationSchema = (): OrganizationSchema => ({
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

  const generateWebsiteSchema = (): WebsiteSchema => ({
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

  const generateArticleSchema = (articleData: any): ArticleSchema => {
    // ✅ SAFE: Validate dates before using them
    const publishedTime = validateAndFormatDate(
      articleData.publishedTime, 
      new Date().toISOString()
    );
    
    const modifiedTime = validateAndFormatDate(
      articleData.modifiedTime, 
      publishedTime // Use publishedTime as fallback
    );

    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleData.title,
      "description": articleData.description,
      "author": {
        "@type": "Person",
        "name": articleData.author
      },
      "publisher": { "@id": "https://event4me.eu/#organization" },
      "datePublished": publishedTime,    // ✅ Always valid
      "dateModified": modifiedTime,      // ✅ Always valid with fallback
      "image": articleData.imageUrl,
      "inLanguage": "ru",
      "mainEntityOfPage": articleData.url
    };
  };

  const schemas: (OrganizationSchema | WebsiteSchema | ArticleSchema)[] = [
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