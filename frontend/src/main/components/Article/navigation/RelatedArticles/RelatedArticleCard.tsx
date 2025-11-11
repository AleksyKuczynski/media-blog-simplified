// src/main/components/Article/RelatedArticles/RelatedArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/main/lib/utils/utils';

interface RelatedArticleCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string; // Full URL constructed in server component
  rubricSlug: string;
  formattedDate: string;
  lang: 'ru';
}

/**
 * Compact vertical card optimized for horizontal carousel
 * Design: Fixed width, image on top, minimal text
 */

// ✅ STYLE CONSTANTS - Following project pattern
export const RELATED_CARD_STYLES = {
  // Card container
  container: 'group block w-full',
  
  // Card structure
  card: 'bg-sf-cont rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col',
  
  // Image container
  imageContainer: 'relative w-full aspect-video overflow-hidden bg-sf-hi',
  
  // Image element
  image: 'object-cover group-hover:scale-110 transition-transform duration-300',
  
  // Content container
  content: 'p-4 flex flex-col flex-grow',
  
  // Title
  title: 'text-base font-semibold line-clamp-2 mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200 flex-grow',
  
  // Date
  date: 'text-xs text-on-sf-var mt-auto',
} as const;

// ✅ SKELETON STYLES
export const RELATED_CARD_SKELETON_STYLES = {
  container: RELATED_CARD_STYLES.container,
  card: cn(RELATED_CARD_STYLES.card, 'animate-pulse'),
  imageContainer: cn(RELATED_CARD_STYLES.imageContainer, 'bg-sf-hi'),
  content: RELATED_CARD_STYLES.content,
  title: 'h-4 bg-on-sf/10 rounded mb-2',
  titleSecond: 'h-4 w-3/4 bg-on-sf/10 rounded mb-2',
  date: 'h-3 w-20 bg-on-sf/10 rounded',
} as const;

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