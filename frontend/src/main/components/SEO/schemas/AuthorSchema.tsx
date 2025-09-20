// src/main/components/SEO/schemas/AuthorSchema.tsx
// Author-specific structured data generation using dictionary

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { generateBreadcrumbs } from '@/main/lib/dictionary/helpers/navigation';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

export interface AuthorSchemaProps {
  dictionary: Dictionary;
  authorData: {
    name: string;
    slug: string;
    bio?: string;
    avatar?: string;
    articleCount: number;
    articles?: Array<{
      title: string;
      slug: string;
      url: string;
      publishedAt?: string;
    }>;
  };
  currentPath: string;
}

/**
 * Generate comprehensive structured data for author pages
 * Uses dictionary content instead of hardcoded text
 */
export const AuthorSchema: React.FC<AuthorSchemaProps> = ({
  dictionary,
  authorData,
  currentPath,
}) => {
  const { seo } = dictionary;
  const { name, slug, bio, avatar, articleCount, articles } = authorData;
  const baseUrl = seo.site.url;
  const canonicalUrl = `${baseUrl}${currentPath}`;

  // Generate breadcrumbs using helper function from navigation helpers
  const breadcrumbs = generateBreadcrumbs(dictionary, ['authors', slug]);

  // Create Person schema for the author
  const authorPersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${canonicalUrl}#person`,
    name,
    description: bio || processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    }),
    url: canonicalUrl,
    
    // Author image if available
    ...(avatar && {
      image: {
        '@type': 'ImageObject',
        url: `${baseUrl}/assets/${avatar}`,
        description: `Фото автора ${name}`,
      },
    }),
    
    // Author works (articles)
    ...(articleCount > 0 && {
      workExample: {
        '@type': 'ItemList',
        name: processTemplate(dictionary.sections.templates.itemByAuthor, {
          item: dictionary.sections.labels.articles,
          author: name,
        }),
        numberOfItems: articleCount,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        ...(articles && articles.length > 0 && {
          itemListElement: articles.map((article, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Article',
              '@id': article.url,
              name: article.title,
              url: article.url,
              author: {
                '@type': 'Person',
                '@id': `${canonicalUrl}#person`,
                name,
              },
              ...(article.publishedAt && {
                datePublished: article.publishedAt,
              }),
            },
          })),
        }),
      },
    }),
    
    // Affiliation with the site
    affiliation: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: seo.site.name,
      url: baseUrl,
    },
    
    // Knowledge about
    knowsAbout: ['Культурные события', 'Искусство', 'Современная культура'],
    
    // Location (if relevant)
    workLocation: {
      '@type': 'Place',
      name: 'Россия',
    },
  };

  // Create ProfilePage schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonicalUrl}#profile`,
    name: processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: 'Профиль',
      author: name,
    }),
    description: bio || processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    }),
    url: canonicalUrl,
    inLanguage: 'ru',
    
    mainEntity: {
      '@id': `${canonicalUrl}#person`,
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
  };

  // Create BreadcrumbList schema using generated breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: index === breadcrumbs.length - 1 ? canonicalUrl : `${baseUrl}${crumb.href}`,
    })),
  };

  // Articles List schema if articles are available
  const articlesListSchema = articles && articles.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#articlesList`,
    name: processTemplate(dictionary.sections.templates.itemByAuthor, {
      item: dictionary.sections.labels.articles,
      author: name,
    }),
    description: `Все статьи автора ${name} на ${seo.site.name}`,
    numberOfItems: articleCount,
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        '@id': article.url,
        headline: article.title,
        url: article.url,
        inLanguage: 'ru',
        author: {
          '@type': 'Person',
          '@id': `${canonicalUrl}#person`,
          name,
        },
        ...(article.publishedAt && {
          datePublished: article.publishedAt,
        }),
        publisher: {
          '@id': `${baseUrl}#organization`,
        },
      },
    })),
  } : null;

  // Combine all schemas
  const schemas = [
    authorPersonSchema,
    profilePageSchema,
    breadcrumbSchema,
    ...(articlesListSchema ? [articlesListSchema] : []),
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

export default AuthorSchema;