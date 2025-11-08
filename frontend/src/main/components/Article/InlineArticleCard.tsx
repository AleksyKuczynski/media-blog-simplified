// src/main/components/Article/InlineArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/main/lib/utils/utils';
import { ArticleCardData } from '@/main/lib/markdown/markdownTypes';

interface InlineArticleCardProps {
  articleCardData: ArticleCardData;
  lang?: string;
}

/**
 * Inline article card optimized for embedding within article body
 * Design: Horizontal layout (image left, text right), compact, max 80px mobile height
 */

// Style constants following project pattern
export const INLINE_CARD_STYLES = {
  // Outer container
  container: 'not-prose my-6 w-full',
  
  // Card link wrapper
  link: 'group block w-full',
  
  // Card structure - horizontal layout
  card: cn(
    'bg-sf-cont rounded-xl overflow-hidden shadow-sm',
    'hover:shadow-lg transition-all duration-300',
    'flex flex-row items-stretch',
    // Mobile: max height 80px, keep horizontal
    'h-20 sm:h-28 md:h-32'
  ),
  
  // Image container - fixed width on left
  imageContainer: cn(
    'relative flex-shrink-0 overflow-hidden bg-sf-hi',
    // Mobile: 80px square, larger on desktop
    'w-20 sm:w-28 md:w-32'
  ),
  
  // Image element
  image: 'object-cover group-hover:scale-110 transition-transform duration-300',
  
  // Content container - takes remaining space
  content: cn(
    'flex flex-col justify-center flex-grow',
    'p-3 sm:p-4',
    'min-w-0' // Allows text truncation
  ),
  
  // Label - "Related Article"
  label: cn(
    'text-xs font-medium uppercase tracking-wide mb-1',
    'text-pr-cont',
    'hidden sm:block' // Hide on mobile to save space
  ),
  
  // Title
  title: cn(
    'font-semibold text-on-sf group-hover:text-pr-cont',
    'transition-colors duration-200',
    'line-clamp-1 sm:line-clamp-2',
    'text-sm sm:text-base'
  ),
  
  // Description - only show on larger screens
  description: cn(
    'text-xs text-on-sf-var mt-1 line-clamp-1',
    'hidden md:block'
  ),
  
  // Date
  date: cn(
    'text-xs text-on-sf-var mt-1',
    'hidden sm:block' // Hide on mobile to save space
  ),
} as const;

export default function InlineArticleCard({
  articleCardData,
  lang = 'ru'
}: InlineArticleCardProps) {
  const {
    slug,
    title,
    description,
    imageSrc,
    rubricSlug,
    publishedAt
  } = articleCardData;
  
  const articleLink = `/${lang}/${rubricSlug}/${slug}`;
  
  const formattedDate = new Date(publishedAt).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={INLINE_CARD_STYLES.container}>
      <Link 
        href={articleLink}
        className={INLINE_CARD_STYLES.link}
        aria-label={`Read related article: ${title}`}
      >
        <article className={INLINE_CARD_STYLES.card}>
          {/* Image - Left Side */}
          {imageSrc && (
            <div className={INLINE_CARD_STYLES.imageContainer}>
              <Image
                src={imageSrc}
                alt={title}
                fill
                className={INLINE_CARD_STYLES.image}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
              />
            </div>
          )}

          {/* Content - Right Side */}
          <div className={INLINE_CARD_STYLES.content}>
            {/* Label */}
            <span className={INLINE_CARD_STYLES.label}>
              Читайте также
            </span>

            {/* Title */}
            <h3 className={INLINE_CARD_STYLES.title}>
              {title}
            </h3>

            {/* Description - desktop only */}
            {description && (
              <p className={INLINE_CARD_STYLES.description}>
                {description}
              </p>
            )}

            {/* Date - hidden on mobile */}
            <time 
              dateTime={publishedAt}
              className={INLINE_CARD_STYLES.date}
            >
              {formattedDate}
            </time>
          </div>
        </article>
      </Link>
    </div>
  );
}