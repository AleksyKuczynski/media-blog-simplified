// src/main/components/ArticleCards/StandardCard.tsx
// MIGRATED: Uses new dictionary system
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '../Interface/Icons';
import { StandardCardProps, getImageDimensions } from './interfaces';

/**
 * StandardCard - MIGRATED to use dictionary.common instead of dict.common
 * Supports regular, latest, and promoted layouts
 */
export function StandardCard({ 
  article, 
  formattedDate, 
  articleLink, 
  imageProps, 
  layout, 
  dictionary // MIGRATED: Now uses full dictionary
}: StandardCardProps) {
  const translation = article.translations[0];
  const imageDimensions = imageProps ? getImageDimensions(imageProps) : null;

  return (
    <Link 
      href={articleLink} 
      className={`
        block group transition-transform duration-200 hover:scale-105
        ${layout === 'promoted' && 'lg:max-xl:hover:scale-100'}
      `}
    >
      <article className={`
        h-full bg-sf-cont rounded-2xl border border-ol-var 
        shadow-sm hover:shadow-lg transition-all duration-300
        overflow-hidden
        ${layout === 'regular' && 'flex flex-col'}
        ${layout === 'promoted' && 'lg:max-xl:flex lg:max-xl:flex-row lg:max-xl:items-center'}
        ${layout === 'latest' && 'sm:max-lg:flex sm:max-lg:flex-row sm:max-lg:items-center xl:flex xl:flex-row xl:items-center'}
      `}>
        
        {/* Image Section */}
        {imageProps && imageDimensions && (
          <div className={`
            relative overflow-hidden
            ${layout === 'regular' && 'aspect-video'}
            ${layout === 'promoted' && 'aspect-video lg:max-xl:w-1/2 lg:max-xl:aspect-[4/3]'}
            ${layout === 'latest' && 'aspect-video sm:max-lg:w-1/3 sm:max-lg:aspect-square xl:w-1/3 xl:aspect-square'}
          `}>
            <Image
              src={imageProps.src}
              alt={imageProps.alt}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes={`
                ${layout === 'regular' && '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                ${layout === 'promoted' && '(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 50vw'}
                ${layout === 'latest' && '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, (max-width: 1280px) 100vw, 33vw'}
              `}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className={`
          p-4 lg:p-6 flex flex-col
          ${layout === 'regular' && 'flex-grow'}
          ${layout === 'promoted' && 'lg:max-xl:w-1/2 lg:max-xl:justify-center'}
          ${layout === 'latest' && 'flex-grow sm:max-lg:justify-center xl:justify-center'}
        `}>
          
          <h3 className={`
            font-bold mb-2 text-on-sf 
            group-hover:text-pr-cont transition-colors duration-200
            ${layout === 'regular' && 'line-clamp-3'}
            ${layout === 'promoted' && 'text-2xl lg:max-xl:text-3xl'}
            ${layout === 'latest' && 'line-clamp-3 text-lg 2xl:text-xl'}
          `}>
            {translation.title}
          </h3>
          
          <time className={`
            text-xs lg:text-sm text-on-sf-var
            ${layout === 'regular' && 'mb-2'}
            ${layout === 'promoted' && 'sm:max-lg:grow'}
            ${layout === 'latest' && 'sm:max-lg:grow xl:grow'}
          `}>
            {formattedDate}
          </time>
          
          {translation.description && (
            <p className={`
              text-sm lg:text-base line-clamp-3 mb-4 text-on-sf-var
              ${layout === 'regular' && 'max-sm:hidden'}
              ${layout === 'promoted' && 'xl:grow'}
            `}>
              {translation.description}
            </p>
          )}
          
          <div className="text-xs lg:text-sm font-medium transition-colors duration-200 flex justify-end items-end text-pr-cont hover:text-pr-fix">
            <span>{dictionary.common.readMore}</span> {/* MIGRATED: Use dictionary.common */}
            <ChevronRightIcon className="ml-1 w-3 h-3" />
          </div>
        </div>
      </article>
    </Link>
  );
}