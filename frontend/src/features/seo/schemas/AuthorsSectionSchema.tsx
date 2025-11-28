// src/main/components/SEO/schemas/AuthorsSectionSchema.tsx

import React from 'react';
import AuthorSectionSchema from './AuthorSectionSchema';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface AuthorsSectionSchemaProps {
  lang: Lang;
  dictionary: Dictionary;
  authors: Array<{
    name: string;
    slug: string;
    avatar?: string;
  }>;
}

/**
 * Multiple Person schemas for AuthorsSection component
 * Static SSR component - generates schema for each author
 * Critical E-A-T signal multiplier for content quality
 * Each author entity linked to their profile page
 */
export default function AuthorsSectionSchema({
  lang,
  dictionary,
  authors,
}: AuthorsSectionSchemaProps): React.ReactElement {
  // Filter out editorial/placeholder authors
  const realAuthors = authors.filter(
    author => author.slug && author.name !== '::EDITORIAL::'
  );

  if (realAuthors.length === 0) {
    return <></>;
  }

  // Generate Person schema for each author
  return (
    <>
      {realAuthors.map((author) => (
        <AuthorSectionSchema
          lang={lang}
          dictionary={dictionary}
          key={author.slug}
          author={author}
        />
      ))}
    </>
  );
}