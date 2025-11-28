// src/main/components/Main/RubricCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dictionary, Lang } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { DIRECTUS_URL } from '@/api/directus';

export interface RubricCardProps {
  rubric: {
    slug: string;
    name: string;
    description?: string;
    nav_icon?: string;
    articleCount?: number;
    iconMetadata?: {
      id: string;
      width: number;
      height: number;
      type: string;
      filename: string;
      title: string;
    } | null;
  };
  lang: Lang;
  dictionary: Dictionary;
}

/**
 * Generate rubric URL from slug and language
 */
const generateRubricUrl = (slug: string, lang: Lang): string => {
  return `/${lang}/${slug}`;
};

export const RubricCard: React.FC<RubricCardProps> = ({
  rubric,
  lang,
  dictionary,
}) => {
  // Generate URL internally from slug
  const rubricUrl = generateRubricUrl(rubric.slug, lang);
  
  // Generate unique key for list rendering (using slug as unique identifier)
  const cardKey = `rubric-${rubric.slug}`;
  
  // Generate accessible labels using dictionary
  const iconAltText = rubric.nav_icon 
    ? processTemplate(dictionary.sections.rubrics.rubricIcon, { name: rubric.name })
    : dictionary.sections.rubrics.noIcon;
  
  const readMoreText = `${dictionary.sections.rubrics.readMoreAbout} ${rubric.name}`;
  const exploreText = `${dictionary.sections.rubrics.exploreRubric} ${rubric.name}`;
  
  return (
    <article 
      className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
      data-rubric-slug={rubric.slug}
      data-key={cardKey}
    >
      {/* Rubric Icon */}
      <div className="mb-4 flex items-center justify-between">
        {rubric.nav_icon ? (
          <div className="relative h-8 w-8">
            <Image
              src={`${DIRECTUS_URL}/assets/${rubric.nav_icon}`}
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
        {rubric.articleCount !== undefined && rubric.articleCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {rubric.articleCount} {dictionary.sections.labels.articles}
          </span>
        )}
      </div>
      
      {/* Rubric Title with generated URL */}
      <h2 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
        <Link 
          href={rubricUrl}
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
        {rubric.articleCount !== undefined && rubric.articleCount > 0 && 
          `. ${rubric.articleCount} ${dictionary.sections.labels.articles}.`
        }
        {` ${readMoreText}.`}
      </div>
    </article>
  );
};

export default RubricCard;