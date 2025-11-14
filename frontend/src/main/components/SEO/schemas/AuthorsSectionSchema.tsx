// src/main/components/SEO/schemas/AuthorsSectionSchema.tsx

import React from 'react';
import AuthorSectionSchema from './AuthorSectionSchema';

interface AuthorsSectionSchemaProps {
  authors: Array<{
    name: string;
    slug: string;
    avatar?: string;
  }>;
  currentArticleUrl: string;
}

/**
 * Multiple Person schemas for AuthorsSection component
 * Static SSR component - generates schema for each author
 * Critical E-A-T signal multiplier for content quality
 * Each author entity linked to their profile page
 */
export default function AuthorsSectionSchema({
  authors,
  currentArticleUrl,
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
          key={author.slug}
          author={author}
          currentArticleUrl={currentArticleUrl}
        />
      ))}
    </>
  );
}