// src/main/components/Main/RubricCard.tsx
// FIXED: Made lang optional, converted to Next.js Image, aligned with HomePage usage

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

export interface RubricCardProps {
  rubric: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon?: string;
    articleCount?: number;
    url: string;
  };
  lang?: string; // FIXED: Made optional with default
  dictionary: Dictionary;
}

/**
 * Clean RubricCard component - FIXED to match HomePage usage and use Next.js Image
 */
export const RubricCard: React.FC<RubricCardProps> = ({
  rubric,
  lang = 'ru', // FIXED: Default to 'ru' if not provided
  dictionary,
}) => {
  // Generate accessible labels using dictionary
  const iconAltText = rubric.icon 
    ? processTemplate(dictionary.sections.rubrics.rubricIcon, { name: rubric.name })
    : dictionary.sections.rubrics.noIcon;
  
  const readMoreText = `${dictionary.sections.rubrics.readMoreAbout} ${rubric.name}`;
  const exploreText = `${dictionary.sections.rubrics.exploreRubric} ${rubric.name}`;
  
  return (
    <article className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg">
      {/* Rubric Icon - FIXED: Using Next.js Image */}
      <div className="mb-4 flex items-center justify-between">
        {rubric.icon ? (
          <div className="relative h-8 w-8">
            <Image
              src={`https://event4me.eu/assets/${rubric.icon}`}
              alt={iconAltText}
              fill
              className="object-contain"
              sizes="32px"
              loading="lazy"
            />
          </div>
        ) : (
          <div 
            className="h-8 w-8 rounded bg-muted flex items-center justify-center"
            aria-label={dictionary.sections.rubrics.noIcon}
          >
            <span className="text-muted-foreground text-xs">
              {rubric.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {/* Article count if available */}
        {rubric.articleCount !== undefined && (
          <span className="text-sm text-muted-foreground">
            {rubric.articleCount} {dictionary.sections.labels.articles}
          </span>
        )}
      </div>
      
      {/* Rubric Title */}
      <h2 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
        <Link 
          href={rubric.url}
          className="before:absolute before:inset-0"
          aria-label={exploreText}
        >
          {rubric.name}
        </Link>
      </h2>
      
      {/* Rubric Description */}
      {rubric.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {rubric.description}
        </p>
      )}
      
      {/* Action Link */}
      <div className="mt-auto">
        <span className="text-sm font-medium text-primary group-hover:underline">
          {dictionary.common.actions.explore} →
        </span>
      </div>
      
      {/* Screen Reader Enhancement */}
      <div className="sr-only">
        {processTemplate(dictionary.sections.templates.itemInCollection, {
          item: rubric.name,
          collection: dictionary.sections.labels.rubrics,
        })}
        {rubric.description && `. ${rubric.description}`}
        {rubric.articleCount !== undefined && 
          `. ${rubric.articleCount} ${dictionary.sections.labels.articles}.`
        }
        {` ${readMoreText}.`}
      </div>
    </article>
  );
};

export default RubricCard;