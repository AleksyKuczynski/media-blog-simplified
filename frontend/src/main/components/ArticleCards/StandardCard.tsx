// src/main/components/ArticleCards/StandardCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/main/lib/utils/utils';
import { ChevronRightIcon } from '../Interface/Icons';
import { StandardCardProps, getImageDimensions } from './interfaces';

// ✅ EXTRACT CURRENT STYLING INTO CONSTANTS - From StandardCard's inline classes
export const STANDARD_CARD_STYLES = {
  // Base card structure
  base: 'h-full bg-sf-cont rounded-2xl border border-ol-var shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden',
  
  // Link wrapper
  link: 'block group transition-transform duration-200 hover:scale-105',
  linkPromoted: 'lg:max-xl:hover:scale-100', // Additional class for promoted
  
  // Layout variants
  layouts: {
    regular: 'flex flex-col',
    promoted: 'lg:max-xl:flex lg:max-xl:flex-row lg:max-xl:items-center', 
    latest: 'sm:max-lg:flex sm:max-lg:flex-row sm:max-lg:items-center xl:flex xl:flex-row xl:items-center',
  },
  
  // Image container variants
  image: {
    base: 'relative overflow-hidden',
    regular: 'aspect-video',
    promoted: 'aspect-video lg:max-xl:w-1/2 lg:max-xl:aspect-[4/3]',
    latest: 'aspect-video sm:max-lg:w-1/3 sm:max-lg:aspect-square xl:w-1/3 xl:aspect-square',
  },
  
  // Image element
  imageElement: 'object-cover group-hover:scale-110 transition-transform duration-300',
  
  // Content container variants  
  content: {
    regular: 'p-4 lg:p-6 flex flex-col flex-grow',
    promoted: 'p-4 lg:p-6 flex flex-col lg:max-xl:w-1/2 lg:max-xl:justify-center',
    latest: 'p-4 lg:p-6 flex flex-col flex-grow sm:max-lg:justify-center xl:justify-center',
  },
  
  // Title variants
  title: {
    base: 'font-bold mb-2 text-on-sf group-hover:text-pr-cont transition-colors duration-200',
    regular: 'line-clamp-3',
    promoted: 'text-2xl lg:max-xl:text-3xl',
    latest: 'line-clamp-3 text-lg 2xl:text-xl',
  },
  
  // Date variants
  date: {
    base: 'text-xs lg:text-sm text-on-sf-var',
    regular: 'mb-2',
    promoted: 'sm:max-lg:grow',
    latest: 'sm:max-lg:grow xl:grow',
  },
  
  // Description variants
  description: {
    base: 'text-sm lg:text-base line-clamp-3 mb-4 text-on-sf-var',
    regular: 'max-sm:hidden',
    promoted: 'xl:grow',
    latest: '', // No special classes for latest
  },
  
  // Read more
  readMore: 'text-xs lg:text-sm font-medium transition-colors duration-200 flex justify-end items-end text-pr-cont hover:text-pr-fix',
  readMoreIcon: 'ml-1 w-3 h-3',
} as const;

// ✅ SKELETON STYLES - Derived from StandardCard constants
export const STANDARD_CARD_SKELETON_STYLES = {
  // Inherit structure
  base: STANDARD_CARD_STYLES.base,
  layouts: STANDARD_CARD_STYLES.layouts,
  content: STANDARD_CARD_STYLES.content,
  
  // Skeleton-specific image styling
  image: {
    regular: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.regular, 'bg-sf-hi animate-pulse'),
    promoted: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.promoted, 'bg-sf-hi animate-pulse'),
    latest: cn(STANDARD_CARD_STYLES.image.base, STANDARD_CARD_STYLES.image.latest, 'bg-sf-hi animate-pulse'),
  },
  
  // Skeleton placeholder elements
  title: 'h-5 bg-on-sf/10 rounded mb-2 animate-pulse',
  titleSecond: 'h-5 w-3/4 bg-on-sf/10 rounded mb-2 animate-pulse',
  date: 'h-4 w-24 bg-on-sf/10 rounded mb-2 animate-pulse',
  description: 'h-4 bg-on-sf/10 rounded mb-1 animate-pulse',
  readMore: 'h-4 w-20 bg-on-sf/10 rounded animate-pulse',
} as const;

// ✅ UPDATED: StandardCard using extracted constants
export function StandardCard({ 
  article, 
  formattedDate, 
  articleLink, 
  imageProps, 
  layout = 'regular',
  dictionary 
}: StandardCardProps) {
  const translation = article.translations[0];
  const imageDimensions = imageProps ? getImageDimensions(imageProps) : null;

  return (
    <Link 
      href={articleLink} 
      className={cn(
        STANDARD_CARD_STYLES.link,
        layout === 'promoted' && STANDARD_CARD_STYLES.linkPromoted
      )}
    >
      <article className={cn(
        STANDARD_CARD_STYLES.base,
        STANDARD_CARD_STYLES.layouts[layout]
      )}>
        
        {/* Image Section */}
        {imageProps && imageDimensions && (
          <div className={cn(
            STANDARD_CARD_STYLES.image.base,
            STANDARD_CARD_STYLES.image[layout]
          )}>
            <Image
              src={imageProps.src}
              alt={imageProps.alt}
              fill
              className={STANDARD_CARD_STYLES.imageElement}
              sizes={`
                ${layout === 'regular' && '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                ${layout === 'promoted' && '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 50vw'}
                ${layout === 'latest' && '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, (max-width: 1280px) 100vw, 33vw'}
              `}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className={STANDARD_CARD_STYLES.content[layout]}>
          
          <h3 className={cn(
            STANDARD_CARD_STYLES.title.base,
            STANDARD_CARD_STYLES.title[layout]
          )}>
            {translation.title}
          </h3>
          
          <time className={cn(
            STANDARD_CARD_STYLES.date.base,
            STANDARD_CARD_STYLES.date[layout]
          )}>
            {formattedDate}
          </time>
          
          {translation.description && (
            <p className={cn(
              STANDARD_CARD_STYLES.description.base,
              STANDARD_CARD_STYLES.description[layout]
            )}>
              {translation.description}
            </p>
          )}
          
          <div className={STANDARD_CARD_STYLES.readMore}>
            <span>{dictionary.common.actions.readMore}</span>
            <ChevronRightIcon className={STANDARD_CARD_STYLES.readMoreIcon} />
          </div>
        </div>
      </article>
    </Link>
  );
}