// src/main/components/SEO/schemas/QuickNavigationSchema.tsx

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface QuickNavigationSchemaProps {
  lang: Lang;
  dictionary: Dictionary;
  currentArticleUrl: string;
}

/**
 * SiteNavigationElement schema for QuickNavigation component
 * Static SSR component - imports dictionary directly
 * Helps search engines understand site structure and internal linking
 */
export default function QuickNavigationSchema({
  lang,
  dictionary,
  currentArticleUrl,
}: QuickNavigationSchemaProps): React.ReactElement {
  try {
    const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
    
    const navigationSchema = {
      '@context': 'https://schema.org' as const,
      '@type': 'SiteNavigationElement',
      '@id': `${currentArticleUrl}#quick-navigation`,
      name: dictionary.sections.home.quickNavigation,
      hasPart: [
        {
          '@type': 'SiteNavigationElement',
          name: dictionary.sections.labels.articles,
          url: `${baseUrl}/${lang}/articles`,
          description: dictionary.navigation.descriptions.articles,
        },
        {
          '@type': 'SiteNavigationElement',
          name: dictionary.sections.labels.rubrics,
          url: `${baseUrl}/${lang}/rubrics`,
          description: dictionary.navigation.descriptions.rubrics,
        },
      ],
    };

    return (
      <SchemaBuilder
        schema={navigationSchema}
        dictionary={dictionary}
        priority="normal"
        enableValidation={true}
        enableOptimization={true}
      />
    );
  } catch (error) {
    console.error('QuickNavigationSchema: Error generating schema', error);
    return <></>;
  }
}