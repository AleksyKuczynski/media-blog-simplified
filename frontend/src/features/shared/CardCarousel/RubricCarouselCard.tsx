// src/features/shared/CardCarousel/cards/RubricCarouselCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/config/i18n';
import { RUBRIC_CAROUSEL_CARD_STYLES } from './styles';
import { processTemplate } from '@/config/i18n/helpers/templates';

interface RubricCarouselCardProps {
  slug: string;
  name: string;
  description?: string;
  iconSrc?: string;
  url: string;
  articleCount?: number;
  dictionary: Dictionary;
}

export default function RubricCarouselCard({
  slug,
  name,
  description,
  iconSrc,
  url,
  articleCount,
  dictionary
}: RubricCarouselCardProps) {
  const exploreText = `${dictionary.sections.rubrics.exploreRubric} ${name}`;

  return (
    <Link 
      href={url} 
      className={RUBRIC_CAROUSEL_CARD_STYLES.container}
      aria-label={exploreText}
    >
      <article className={RUBRIC_CAROUSEL_CARD_STYLES.card}>
        <div className={RUBRIC_CAROUSEL_CARD_STYLES.content}>
          {/* Icon */}
          {iconSrc ? (
            <div className={RUBRIC_CAROUSEL_CARD_STYLES.iconWrapper}>
              <Image
                src={iconSrc}
                alt={name}
                fill
                className={RUBRIC_CAROUSEL_CARD_STYLES.iconImage}
                sizes="48px"
              />
            </div>
          ) : (
            <div className={RUBRIC_CAROUSEL_CARD_STYLES.iconFallback}>
              <span className={RUBRIC_CAROUSEL_CARD_STYLES.iconFallbackText}>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Text */}
          <div className={RUBRIC_CAROUSEL_CARD_STYLES.textContent}>
            <h3 className={RUBRIC_CAROUSEL_CARD_STYLES.name}>
              {name}
            </h3>
            {description && (
              <p className={RUBRIC_CAROUSEL_CARD_STYLES.description}>
                {description}
              </p>
            )}
            {articleCount !== undefined && articleCount > 0 && (
              <p className={RUBRIC_CAROUSEL_CARD_STYLES.articleCount}>
                {processTemplate(dictionary.sections.templates.totalCount, {
              count: articleCount.toString(),
              countLabel: dictionary.common.count.articles
            })} 
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}