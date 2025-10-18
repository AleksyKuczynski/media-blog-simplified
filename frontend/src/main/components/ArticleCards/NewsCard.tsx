// src/main/components/ArticleCards/NewsCard.tsx

import Link from 'next/link';
import { cn } from '@/main/lib/utils/utils';
import { NewsCardProps } from './interfaces';

// ✅ EXTRACT NEWSCARD STYLING INTO CONSTANTS - From inline classes
export const NEWS_CARD_STYLES = {
  // Base card structure
  base: 'bg-sf-cont p-4 shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-200',
  
  // Link wrapper
  link: 'block h-full',
  
  // Title
  title: 'text-lg mb-2 font-display text-on-sf hover:text-pr-cont transition-colors duration-200',
  
  // Date  
  date: 'text-xs mb-2 text-on-sf-var',
  
  // Description
  description: 'line-clamp-3 text-sm text-on-sf-var mb-3',
  
  // Read more container
  readMoreContainer: '',
  
  // Read more text
  readMore: 'text-xs font-semibold text-pr-cont hover:text-pr-fix transition-colors duration-200',
} as const;

// ✅ SKELETON STYLES - Derived from NewsCard constants
export const NEWS_CARD_SKELETON_STYLES = {
  // Inherit base structure
  base: cn(NEWS_CARD_STYLES.base, 'animate-pulse'),
  
  // Skeleton-specific elements
  title: 'h-5 bg-on-sf/10 rounded mb-2',
  titleSecond: 'h-5 w-4/5 bg-on-sf/10 rounded mb-2',
  date: 'h-3 w-20 bg-on-sf/10 rounded mb-2',
  description: 'h-4 bg-on-sf/10 rounded',
  readMore: 'h-3 w-16 bg-on-sf/10 rounded',
} as const;

// ✅ UPDATED: NewsCard using extracted constants
export function NewsCard({ 
  article, 
  formattedDate, 
  articleLink, 
  dictionary 
}: NewsCardProps) {
  const translation = article.translations[0];

  return (
    <article className={NEWS_CARD_STYLES.base}>
      <Link href={articleLink} className={NEWS_CARD_STYLES.link}>
        <h2 className={NEWS_CARD_STYLES.title}>
          {translation.title}
        </h2>
        
        <p className={NEWS_CARD_STYLES.date}>
          {formattedDate}
        </p>
        
        <p className={NEWS_CARD_STYLES.description}>
          {translation.description}
        </p>
        
        <div className={NEWS_CARD_STYLES.readMoreContainer}>
          <span className={NEWS_CARD_STYLES.readMore}>
            {dictionary.common.actions.readMore}
          </span>
        </div>
      </Link>
    </article>
  );
}