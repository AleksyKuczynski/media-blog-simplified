// src/main/components/SEO/schemas/AuthorSchema.tsx
// REFACTORED: Using SchemaComposer - Reduced from 120+ to 40 lines

import React from 'react';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';

// ===================================================================
// AUTHOR SCHEMA TYPES
// ===================================================================

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

// ===================================================================
// MAIN AUTHOR SCHEMA COMPONENT - REFACTORED
// ===================================================================

/**
 * Generate structured data for author pages
 * REFACTORED: Uses SchemaComposer for standardized generation
 */
export const AuthorSchema: React.FC<AuthorSchemaProps> = ({
  dictionary,
  authorData,
  currentPath,
}) => {
  try {
    const { name, slug, bio, avatar, articleCount, articles = [] } = authorData;
    const { seo } = dictionary;
    
    if (!seo?.site) {
      console.error('AuthorSchema: Invalid dictionary structure');
      return null;
    }

    const baseUrl = seo.site.url.replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}${currentPath}`;

    // Generate breadcrumbs for author page
    const breadcrumbs = [
      {
        name: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        name: dictionary.sections.labels.authors,
        href: '/ru/authors',
      },
      {
        name: name,
        href: currentPath,
      },
    ];

    // Use SchemaComposer for standardized schema generation
    const composer = new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization('editorial')
      .addWebsite()
      .addBreadcrumbs(breadcrumbs);

    // Add ProfilePage schema
    composer.addCustomSchema({
      '@type': 'ProfilePage',
      '@id': `${canonicalUrl}#profile`,
      name: processTemplate(dictionary.sections.authors.profileDescription, { author: name }),
      description: bio || processTemplate(dictionary.sections.templates.authorWorksDescription, {
        author: name,
        siteName: seo.site.name,
      }),
      url: canonicalUrl,
      
      // Main entity - the Person
      mainEntity: {
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
            caption: `Фото автора ${name}`,
          },
        }),
        
        // Articles count using dictionary template
        knowsAbout: processTemplate(dictionary.sections.templates.totalCount, {
          count: articleCount.toString(),
          countLabel: dictionary.common.count.articles,
        }),
      },
    });

    // Add ItemList for articles if available
    if (articles.length > 0) {
      composer.addCustomSchema({
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#articlesList`,
        name: processTemplate(dictionary.sections.templates.itemByAuthor, {
          items: dictionary.sections.labels.articles,
          author: name,
        }),
        description: processTemplate(dictionary.sections.templates.itemsInCollectionDescription, {
          items: dictionary.sections.labels.articles,
          collection: `автора ${name}`,
          siteName: seo.site.name,
        }),
        numberOfItems: articleCount,
        itemListElement: articles.map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Article',
            '@id': article.url,
            headline: article.title,
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
      });
    }

    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="normal"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('AuthorSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Minimal author schema for performance-critical pages
 */
export const MinimalAuthorSchema: React.FC<Pick<AuthorSchemaProps, 'dictionary' | 'authorData'>> = ({
  dictionary,
  authorData,
}) => {
  return <AuthorSchema dictionary={dictionary} authorData={authorData} currentPath="" />;
};

export default AuthorSchema;