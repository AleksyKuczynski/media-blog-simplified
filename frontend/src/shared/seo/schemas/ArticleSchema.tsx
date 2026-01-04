// frontend/src/shared/seo/schemas/ArticleSchema.tsx

import React from 'react';
import { Dictionary } from '@/config/i18n';
import { getSafeArticleDates } from '@/lib/utils/seoDateUtils';
import { SchemaComposer, SchemaBuilder } from '../core/SchemaBuilder';
import { BreadcrumbItem } from '../core/types';

// ===================================================================
// SIMPLIFIED ARTICLE SCHEMA COMPONENT
// ===================================================================

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
      credentials?: string;
      telegram_url?: string;
      expertise_areas?: string;
    };
    illustrator?: {  // ADD
      name: string;
      slug?: string;
      credentials?: string;
    };
    publishedAt: string;
    updatedAt: string | null;
    imageUrl?: string;
    tags?: string[];
    wordCount?: number;
    readingTime?: number;
  };
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Complete Article structured data component
 * REFACTORED: Uses SchemaComposer for standardized schema generation
 */

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  dictionary,
  articleData,
  breadcrumbs = [],
}) => {
  try {
    const { 
      title, 
      description, 
      lead, 
      slug, 
      rubricSlug, 
      rubricName,
      author, 
      illustrator,
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

    // Handle dates safely
    const safeDates = getSafeArticleDates(publishedAt, updatedAt);

    // Create comprehensive schema using SchemaComposer
    const composer = new SchemaComposer(dictionary, canonicalUrl)
      .addOrganization('editorial')
      .addWebsite()
      .addBreadcrumbs(breadcrumbs)
      .addArticle({
        title,
        description: finalDescription,
        author,
        publishedAt: safeDates.publishedTime,
        modifiedAt: safeDates.modifiedTime,
        imageUrl: finalImageUrl,
        section: rubricName || rubricSlug,
        tags,
        wordCount,
        readingTime,
      });

    // Add illustrator as contributor if present
    if (illustrator?.slug) {
      composer.addCustomSchema({
        '@type': 'Person',
        '@id': `${baseUrl}/ru/authors/${illustrator.slug}#person`,
        name: illustrator.name,
        url: `${baseUrl}/ru/authors/${illustrator.slug}`,
        jobTitle: 'Illustrator',
        ...(illustrator.credentials && { description: illustrator.credentials }),
      });
    }

    // BUILD the schema before passing to SchemaBuilder
    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="high"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('ArticleSchema: Error generating schema', error);
    return null;
  }
};

/**
 * Minimal Article schema for performance-critical pages
 */
export const MinimalArticleSchema: React.FC<Pick<ArticleSchemaProps, 'dictionary' | 'articleData'>> = ({
  dictionary,
  articleData,
}) => {
  try {
    const { title, slug, rubricSlug, author, publishedAt, updatedAt, imageUrl } = articleData;
    const { seo } = dictionary;
    const baseUrl = seo.site.url.replace(/\/$/, '');
    const canonicalUrl = `${baseUrl}/ru/${rubricSlug}/${slug}`;
    
    const safeDates = getSafeArticleDates(publishedAt, updatedAt);

    const schema = new SchemaComposer(dictionary, canonicalUrl)
      .addArticle({
        title,
        description: title, // Minimal description
        author,
        publishedAt: safeDates.publishedTime,
        modifiedAt: safeDates.modifiedTime,
        imageUrl,
      })
      .build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        enableValidation={false}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('MinimalArticleSchema: Error generating schema', error);
    return null;
  }
};

export default ArticleSchema;