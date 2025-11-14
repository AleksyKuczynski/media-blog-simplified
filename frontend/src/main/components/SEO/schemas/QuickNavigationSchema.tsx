// src/main/components/SEO/schemas/QuickNavigationSchema.tsx

import React from 'react';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { SchemaBuilder } from '../core/SchemaBuilder';

interface QuickNavigationSchemaProps {
  currentArticleUrl: string;
}

/**
 * SiteNavigationElement schema for QuickNavigation component
 * Static SSR component - imports dictionary directly
 * Helps search engines understand site structure and internal linking
 */
export default function QuickNavigationSchema({
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
          url: `${baseUrl}/${DEFAULT_LANG}/articles`,
          description: dictionary.navigation.descriptions.articles,
        },
        {
          '@type': 'SiteNavigationElement',
          name: dictionary.sections.labels.rubrics,
          url: `${baseUrl}/${DEFAULT_LANG}/rubrics`,
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