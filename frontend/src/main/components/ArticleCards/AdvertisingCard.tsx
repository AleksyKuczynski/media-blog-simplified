// src/main/components/ArticleCards/AdvertisingCard.tsx

import Link from 'next/link';
import { cn } from '@/main/lib/utils/utils';
import { AdvertisingCardProps } from './interfaces';

// ✅ EXTRACT ADVERTISING CARD STYLING INTO CONSTANTS - From inline classes
export const ADVERTISING_CARD_STYLES = {
  // Base card structure with gradient
  base: 'bg-gradient-to-br from-pr-cont to-pr-fix text-on-pr-cont p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105',
  
  // Link wrapper
  link: 'block h-full',
  
  // Content container
  content: 'flex flex-col h-full',
  
  // Title
  title: 'text-xl font-bold mb-3 text-on-pr-cont',
  
  // Description
  description: 'text-sm mb-4 flex-grow text-on-pr-cont/90 line-clamp-4',
  
  // Button container
  buttonContainer: 'mt-auto',
  
  // Button/Read more
  button: 'text-sm font-semibold bg-on-pr-cont text-pr-cont px-3 py-1 rounded-full hover:bg-on-pr-cont/90 transition-colors duration-200',
} as const;

// ✅ SKELETON STYLES - Derived from AdvertisingCard constants, but adapted for skeleton
export const ADVERTISING_CARD_SKELETON_STYLES = {
  // Skeleton version - use neutral gradient instead of brand colors
  base: 'bg-gradient-to-br from-sf-hi to-sf-hst p-6 rounded-2xl shadow-lg animate-pulse',
  
  // Content structure
  content: ADVERTISING_CARD_STYLES.content,
  buttonContainer: ADVERTISING_CARD_STYLES.buttonContainer,
  
  // Skeleton-specific elements
  title: 'h-6 bg-on-sf/10 rounded mb-3',
  titleSecond: 'h-6 w-3/4 bg-on-sf/10 rounded mb-3',
  description: 'h-4 bg-on-sf/10 rounded',
  button: 'h-7 w-20 bg-on-sf/20 rounded-full',
} as const;

// ✅ UPDATED: AdvertisingCard using extracted constants
export function AdvertisingCard({ 
  article, 
  articleLink, 
  dictionary 
}: AdvertisingCardProps) {
  const translation = article.translations[0];

  return (
    <article className={ADVERTISING_CARD_STYLES.base}>
      <Link href={articleLink} className={ADVERTISING_CARD_STYLES.link}>
        <div className={ADVERTISING_CARD_STYLES.content}>
          <h2 className={ADVERTISING_CARD_STYLES.title}>
            {translation.title}
          </h2>
          
          {translation.description && (
            <p className={ADVERTISING_CARD_STYLES.description}>
              {translation.description}
            </p>
          )}
          
          <div className={ADVERTISING_CARD_STYLES.buttonContainer}>
            <span className={ADVERTISING_CARD_STYLES.button}>
              {dictionary.common.actions.readMore}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}