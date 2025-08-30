// src/main/components/SEO/HomePageSchema.tsx - Optimized for existing structure
import { ArticleCardType, Rubric } from '@/main/lib/directus/directusInterfaces';

interface HomePageSchemaProps {
  data: {
    site: {
      name: string;
      url: string;
      description: string;
    };
    articles: {
      featured: ArticleCardType[];
      latest: ArticleCardType[];
    };
    rubrics: Rubric[];
  };
}

export function HomePageSchema({ data }: HomePageSchemaProps) {
  // Enhanced Organization Schema optimized for Google & Yandex
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://event4me.eu/#organization",
    "name": data.site.name,
    "alternateName": "Event4Me",
    "url": data.site.url,
    "logo": {
      "@type": "ImageObject",
      "url": "https://event4me.eu/logo.png",
      "width": 512,
      "height": 512
    },
    "description": data.site.description,
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@event4me.eu",
      "contactType": "customer support",
      "availableLanguage": ["Russian"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Russia"
    },
    "knowsAbout": ["Cultural events", "Music", "Ideas and trends", "Entertainment"]
  };

  // Website Schema with search functionality
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://event4me.eu/#website", 
    "name": data.site.name,
    "url": data.site.url,
    "description": data.site.description,
    "publisher": {
      "@id": "https://event4me.eu/#organization"
    },
    "inLanguage": "ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://event4me.eu/ru/search?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // WebPage Schema for homepage
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://event4me.eu/ru/#webpage",
    "url": "https://event4me.eu/ru",
    "name": `${data.site.name} | Главная`,
    "description": data.site.description,
    "inLanguage": "ru",
    "isPartOf": {
      "@id": "https://event4me.eu/#website"
    },
    "publisher": {
      "@id": "https://event4me.eu/#organization"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": "https://event4me.eu/ru"
        }
      ]
    }
  };

  // Blog Schema highlighting featured content
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://event4me.eu/ru/#blog",
    "name": `${data.site.name} Blog`,
    "description": data.site.description,
    "url": "https://event4me.eu/ru",
    "inLanguage": "ru",
    "author": {
      "@id": "https://event4me.eu/#organization"
    },
    "publisher": {
      "@id": "https://event4me.eu/#organization"
    },
    // Include featured articles in schema
    "blogPost": data.articles.featured.slice(0, 3).map(article => ({
      "@type": "BlogPosting",
      "@id": `https://event4me.eu/ru/${article.rubric_slug}/${article.slug}#article`,
      "headline": article.translations?.[0]?.title || article.slug,
      "description": article.translations?.[0]?.description || "",
      "url": `https://event4me.eu/ru/${article.rubric_slug}/${article.slug}`,
      "datePublished": article.published_at,
      "inLanguage": "ru",
      "author": article.authors?.map(author => ({
        "@type": "Person",
        "name": author.name,
        "url": `https://event4me.eu/ru/authors/${author.slug}`
      })) || [{
        "@type": "Organization", 
        "name": "EventForMe Editorial"
      }],
      "publisher": {
        "@id": "https://event4me.eu/#organization"
      },
      "articleSection": article.rubric_slug
    }))
  };

  return (
    <>
      {/* Core schemas for optimal SEO */}
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
          __html: JSON.stringify(webPageSchema)
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema)
        }}
      />
    </>
  );
}