// src/features/rubric-display/RubricCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dictionary, Lang } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { DIRECTUS_URL } from '@/api/directus';
import { RUBRIC_CARD_STYLES } from './styles';

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

const generateRubricUrl = (slug: string, lang: Lang): string => {
  return `/${lang}/${slug}`;
};

export const RubricCard: React.FC<RubricCardProps> = ({
  rubric,
  lang,
  dictionary,
}) => {
  const rubricUrl = generateRubricUrl(rubric.slug, lang);
  const cardKey = `rubric-${rubric.slug}`;
  
  const iconAltText = rubric.nav_icon 
    ? processTemplate(dictionary.sections.rubrics.rubricIcon, { name: rubric.name })
    : dictionary.sections.rubrics.noIcon;
  
  const readMoreText = `${dictionary.sections.rubrics.readMoreAbout} ${rubric.name}`;
  const exploreText = `${dictionary.sections.rubrics.exploreRubric} ${rubric.name}`;
  
  return (
    <article 
      className={RUBRIC_CARD_STYLES.card}
      data-rubric-slug={rubric.slug}
      data-key={cardKey}
    >
      {/* Header with icon and count */}
      <div className={RUBRIC_CARD_STYLES.header}>
        {rubric.nav_icon ? (
          <div className={RUBRIC_CARD_STYLES.iconWrapper}>
            <Image
              src={`${DIRECTUS_URL}/assets/${rubric.nav_icon}`}
              alt={iconAltText}
              fill
              className={RUBRIC_CARD_STYLES.iconImage}
              sizes="32px"
              loading="lazy"
            />
          </div>
        ) : (
          <div 
            className={RUBRIC_CARD_STYLES.iconFallback}
            aria-label={dictionary.sections.rubrics.noIcon}
          >
            <span className={RUBRIC_CARD_STYLES.iconFallbackText}>
              {rubric.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        {rubric.articleCount !== undefined && rubric.articleCount > 0 && (
          <span className={RUBRIC_CARD_STYLES.articleCount}>
            {rubric.articleCount} {dictionary.sections.labels.articles}
          </span>
        )}
      </div>
      
      {/* Title */}
      <h2 className={RUBRIC_CARD_STYLES.title}>
        <Link 
          href={rubricUrl}
          className={RUBRIC_CARD_STYLES.titleLink}
          aria-label={exploreText}
        >
          {rubric.name}
        </Link>
      </h2>
      
      {/* Description */}
      {rubric.description && (
        <p className={RUBRIC_CARD_STYLES.description}>
          {rubric.description}
        </p>
      )}
      
      {/* Action */}
      <div className={RUBRIC_CARD_STYLES.action}>
        <span className={RUBRIC_CARD_STYLES.actionText}>
          {dictionary.common.actions.explore} →
        </span>
      </div>
      
      {/* Screen reader */}
      <div className={RUBRIC_CARD_STYLES.srOnly}>
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