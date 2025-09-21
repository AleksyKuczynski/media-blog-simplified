// src/main/components/SEO/schemas/ArticleSchema.tsx
// Article-specific structured data generation following established patterns

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { getSafeArticleDates } from '@/main/lib/utils/seoDateUtils';

export interface ArticleSchemaProps {
  dictionary: Dictionary;
  articleData: {
    title: string;
    description?: string;
    lead?: string;
    slug: string;
    rubricSlug: string;
    rubricName?: string;
    author: {
      name: string;
      slug?: string;
    };
    publishedAt: string;
    updatedAt: string | null; // FIXED: Allow null
    imageUrl?: string;
    tags?: string[];
    wordCount?: number;
    readingTime?: number;
  };
  breadcrumbs?: Array<{ name: string; href?: string }>;
}

/**
 * Complete Article structured data component
 * Generates comprehensive Schema.org markup for articles
 */
export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  dictionary,
  articleData,
  breadcrumbs = [],
}) => {
  const { 
    title, 
    description, 
    lead, 
    slug, 
    rubricSlug, 
    rubricName,
    author, 
    publishedAt, 
    updatedAt, 
    imageUrl, 
    tags = [],
    wordCount,
    readingTime 
  } = articleData;

  const { seo } = dictionary;
  const baseUrl = seo.site.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/ru/${rubricSlug}/${slug}`;
  const finalImageUrl = imageUrl || `${baseUrl}/og-default.jpg`;
  const finalDescription = description || lead || '';

  // Handle dates safely - use getSafeArticleDates to handle null updatedAt
  const safeDates = getSafeArticleDates(publishedAt, updatedAt);

  // Create main Article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    headline: title,
    description: finalDescription,
    url: canonicalUrl,
    datePublished: safeDates.publishedTime,
    dateModified: safeDates.modifiedTime,
    inLanguage: 'ru',
    
    // Author information
    author: {
      '@type': 'Person',
      '@id': author.slug ? `${baseUrl}/ru/authors/${author.slug}#person` : undefined,
      name: author.name,
      ...(author.slug && {
        url: `${baseUrl}/ru/authors/${author.slug}`,
      }),
    },
    
    // Publisher information
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: seo.site.name,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 80,
      },
    },
    
    // Main entity reference
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
    },
    
    // Image information
    image: {
      '@type': 'ImageObject',
      url: finalImageUrl,
      width: 1200,
      height: 630,
      caption: title,
    },
    
    // Article section/category
    articleSection: rubricName || rubricSlug,
    
    // Keywords/tags
    ...(tags.length > 0 && {
      keywords: tags.join(', '),
    }),
    
    // Reading metrics (if available)
    ...(wordCount && {
      wordCount: wordCount,
    }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
    
    // Content location
    contentLocation: {
      '@type': 'Country',
      name: 'Россия',
    },
    
    // Publishing specifics
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
    },
  };

  // Create WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    name: title,
    description: finalDescription,
    url: canonicalUrl,
    inLanguage: 'ru',
    
    mainEntity: {
      '@id': `${canonicalUrl}#article`,
    },
    
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      name: seo.site.name,
      url: baseUrl,
    },
    
    breadcrumb: {
      '@id': `${canonicalUrl}#breadcrumb`,
    },
    
    // Primary image
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: finalImageUrl,
    },
  };

  // Create Organization schema for publisher
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: seo.site.name,
    url: baseUrl,
    description: seo.site.description,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: 200,
      height: 80,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: seo.site.contactEmail,
      contactType: 'editorial',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Россия',
    },
    ...(seo.site.socialProfiles.length > 0 && {
      sameAs: seo.site.socialProfiles,
    }),
  };

  // Create BreadcrumbList schema if breadcrumbs are provided
  const breadcrumbSchema = breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: index === breadcrumbs.length - 1 
        ? canonicalUrl 
        : crumb.href 
          ? `${baseUrl}${crumb.href}`
          : canonicalUrl,
    })),
  } : null;

  // Combine all schemas
  const schemas = [
    articleSchema,
    webPageSchema,
    organizationSchema,
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema, null, 0),
      }}
    />
  );
};

/**
 * Minimal Article schema for performance-critical pages
 */
export const MinimalArticleSchema: React.FC<Pick<ArticleSchemaProps, 'dictionary' | 'articleData'>> = ({
  dictionary,
  articleData,
}) => {
  const { title, slug, rubricSlug, author, publishedAt, updatedAt, imageUrl } = articleData;
  const { seo } = dictionary;
  const baseUrl = seo.site.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/ru/${rubricSlug}/${slug}`;

  const minimalSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    url: canonicalUrl,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: seo.site.name,
      url: baseUrl,
    },
    ...(imageUrl && {
      image: imageUrl,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(minimalSchema, null, 0),
      }}
    />
  );
};

export default ArticleSchema;