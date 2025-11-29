// src/main/components/Article/RelatedArticles/RelatedArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Lang } from '@/config/i18n';
import { RELATED_CARD_SKELETON_STYLES, RELATED_CARD_STYLES } from './styles';

interface RelatedArticleCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string; // Full URL constructed in server component
  rubricSlug: string;
  formattedDate: string;
  lang: Lang;
}

/**
 * Compact vertical card optimized for horizontal carousel
 * Design: Fixed width, image on top, minimal text
 */

export default function RelatedArticleCard({
  slug,
  title,
  publishedAt,
  imageSrc, // Full URL passed from server component
  rubricSlug,
  formattedDate,
  lang
}: RelatedArticleCardProps) {
  
  const articleLink = `/${lang}/${rubricSlug}/${slug}`;

  return (
    <Link 
      href={articleLink} 
      className={RELATED_CARD_STYLES.container}
      aria-label={`Read article: ${title}`}
    >
      <article className={RELATED_CARD_STYLES.card}>
        {/* Image */}
        {imageSrc && (
          <div className={RELATED_CARD_STYLES.imageContainer}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className={RELATED_CARD_STYLES.image}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 320px"
            />
          </div>
        )}

        {/* Content */}
        <div className={RELATED_CARD_STYLES.content}>
          {/* Title */}
          <h3 className={RELATED_CARD_STYLES.title}>
            {title}
          </h3>

          {/* Date */}
          <time 
            dateTime={publishedAt}
            className={RELATED_CARD_STYLES.date}
          >
            {formattedDate}
          </time>
        </div>
      </article>
    </Link>
  );
}

/**
 * Skeleton loader for RelatedArticleCard
 */
export function RelatedArticleCardSkeleton() {
  return (
    <div className={RELATED_CARD_SKELETON_STYLES.container}>
      <div className={RELATED_CARD_SKELETON_STYLES.card}>
        {/* Image skeleton */}
        <div className={RELATED_CARD_SKELETON_STYLES.imageContainer} />

        {/* Content skeleton */}
        <div className={RELATED_CARD_SKELETON_STYLES.content}>
          {/* Title skeleton - 2 lines */}
          <div className={RELATED_CARD_SKELETON_STYLES.title} />
          <div className={RELATED_CARD_SKELETON_STYLES.titleSecond} />

          {/* Date skeleton */}
          <div className={RELATED_CARD_SKELETON_STYLES.date} />
        </div>
      </div>
    </div>
  );
}