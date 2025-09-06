import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';

// Enhanced interfaces
interface CollectionPageSchema {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  "@id": string;
  "name": string;
  "description": string;
  "url": string;
  "inLanguage": string;
  "isPartOf": { "@id": string };
  "mainEntity": {
    "@type": "ItemList";
    "numberOfItems": number;
    "itemListElement": Array<{
      "@type": "ListItem";
      "position": number;
      "item": {
        "@type": "Thing";
        "@id": string;
        "name": string;
        "description": string;
        "url": string;
        "image"?: string;
      };
    }>;
  };
  "breadcrumb": {
    "@type": "BreadcrumbList";
    "itemListElement": Array<{
      "@type": "ListItem";
      "position": number;
      "name": string;
      "item": string;
    }>;
  };
}

// Extended interfaces for existing schemas
interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  "@id": string;
  "name": string;
  "description": string;
  "url": string;
  "logo": string;
  "contactPoint": {
    "@type": "ContactPoint";
    "email": string;
    "contactType": string;
    "availableLanguage": string[];
  };
  "sameAs": string[];
  "areaServed": string[];
  "knowsLanguage": string[];
}

interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  "@id": string;
  "url": string;
  "name": string;
  "description": string;
  "inLanguage": string;
  "publisher": { "@id": string };
  "potentialAction": {
    "@type": "SearchAction";
    "target": {
      "@type": "EntryPoint";
      "urlTemplate": string;
    };
    "query-input": string;
  };
}

interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  "headline": string;
  "description": string;
  "author": {
    "@type": "Person";
    "name": string;
  };
  "publisher": { "@id": string };
  "datePublished": string;
  "dateModified": string;
  "image": string;
  "inLanguage": string;
  "mainEntityOfPage": string;
}

// Enhanced props interface
interface StructuredDataManagerProps {
  dict: Dictionary;
  pageType: 'home' | 'article' | 'rubric' | 'author' | 'search' | 'rubrics-collection';
  data?: {
    // For articles
    title?: string;
    description?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    imageUrl?: string;
    url?: string;
    // For rubrics
    name?: string;
    articleCount?: number;
    // For collections
    rubrics?: Array<{
      slug: string;
      name: string;
      description: string;
      articleCount: number;
      nav_icon?: string;
    }>;
    totalItems?: number;
  };
}

function validateAndFormatDate(dateString: string | undefined, fallback: string): string {
  if (!dateString) return fallback;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return fallback;
    }
    return date.toISOString();
  } catch {
    return fallback;
  }
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

  // ✅ NEW: Collection page schema for rubrics listing
  const generateCollectionPageSchema = (): CollectionPageSchema => {
    const rubrics = data?.rubrics || [];
    const totalItems = data?.totalItems || rubrics.length;

    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": "https://event4me.eu/ru/rubrics#collection",
      "name": dict.seo.structuredData.rubricsCollection.name,
      "description": dict.seo.structuredData.rubricsCollection.description,
      "url": "https://event4me.eu/ru/rubrics",
      "inLanguage": "ru",
      "isPartOf": { "@id": "https://event4me.eu/#website" },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalItems,
        "itemListElement": rubrics.map((rubric, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Thing",
            "@id": `https://event4me.eu/ru/${rubric.slug}#rubric`,
            "name": rubric.name,
            "description": rubric.description || `Статьи в рубрике ${rubric.name}`,
            "url": `https://event4me.eu/ru/${rubric.slug}`,
            ...(rubric.nav_icon && {
              "image": `https://event4me.eu/assets/${rubric.nav_icon}`
            })
          }
        }))
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://event4me.eu/ru"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": dict.sections.rubrics.allRubrics,
            "item": "https://event4me.eu/ru/rubrics"
          }
        ]
      }
    };
  };

  const generateArticleSchema = (articleData: any): ArticleSchema => {
    const publishedTime = validateAndFormatDate(
      articleData.publishedTime, 
      new Date().toISOString()
    );
    
    const modifiedTime = validateAndFormatDate(
      articleData.modifiedTime, 
      publishedTime
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
      "datePublished": publishedTime,
      "dateModified": modifiedTime,
      "image": articleData.imageUrl,
      "inLanguage": "ru",
      "mainEntityOfPage": articleData.url
    };
  };

  // Generate appropriate schemas based on page type
  const schemas: (OrganizationSchema | WebsiteSchema | ArticleSchema | CollectionPageSchema)[] = [
    generateOrganizationSchema(),
    generateWebsiteSchema()
  ];

  // Add page-specific schemas
  if (pageType === 'article' && data) {
    schemas.push(generateArticleSchema(data));
  }

  if (pageType === 'rubrics-collection') {
    schemas.push(generateCollectionPageSchema());
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
}