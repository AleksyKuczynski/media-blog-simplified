// src/main/components/SEO/schemas/AuthorSectionSchema.tsx

import React from 'react';
import { SchemaBuilder } from '../core/SchemaBuilder';
import { Dictionary, Lang } from '@/config/i18n';

interface AuthorSectionSchemaProps {
  lang: Lang;
  dictionary: Dictionary;
  author: {
    name: string;
    slug: string;
    avatar?: string;
  };
}

/**
 * Person schema for AuthorSection component
 * Static SSR component - imports dictionary directly
 * Critical E-A-T signal for content quality
 * Links author entity to profile page
 */
export default function AuthorSectionSchema({
  lang,
  dictionary,
  author,
}: AuthorSectionSchemaProps): React.ReactElement {
  try {
    const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
    const authorProfileUrl = `${baseUrl}/${lang}/authors/${author.slug}`;
    
    const personSchema = {
      '@context': 'https://schema.org' as const,
      '@type': 'Person',
      '@id': `${authorProfileUrl}#person`,
      name: author.name,
      url: authorProfileUrl,
      sameAs: [authorProfileUrl],
      mainEntityOfPage: {
        '@type': 'ProfilePage',
        '@id': `${authorProfileUrl}#profile`,
        url: authorProfileUrl,
      },
      ...(author.avatar && {
        image: {
          '@type': 'ImageObject',
          url: `${baseUrl}/assets/${author.avatar}`,
          caption: author.name,
        },
      }),
    };

    return (
      <SchemaBuilder
        schema={personSchema}
        dictionary={dictionary}
        priority="high"
        enableValidation={true}
        enableOptimization={true}
      />
    );
  } catch (error) {
    console.error('AuthorSectionSchema: Error generating schema', error);
    return <></>;
  }
}