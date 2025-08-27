// src/main/components/ArticleCards/StandardCard.tsx - FIXED IMAGE SIZING
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '../Interface/Icons';
import { StandardCardProps } from './interfaces';
import { twMerge } from 'tailwind-merge';

export function StandardCard({
  article,
  formattedDate,
  articleLink,
  dict,
  imageProps,
  layout = 'regular',
  lang,
}: StandardCardProps) {
  const translation = article.translations[0];

  // Direct rounded theme classes - no more theme switching
  const containerStyles = twMerge(
    'relative bg-sf-cont rounded-2xl border border-ol-var shadow-sm hover:shadow-lg transition-shadow duration-200',
    layout === 'promoted' && 'h-full sm:max-lg:pb-6',
    layout === 'latest' && 'px-2 sm:px-0'
  );

  const contentWrapperStyles = twMerge(
    'flex flex-col bg-sf-cont rounded-3xl overflow-hidden',
    layout === 'regular' && 'lg:h-full sm:max-lg:grid xl:grid grid-cols-3',
    layout === 'promoted' && 'h-full sm:max-xl:grid grid-cols-3 lg:grid-cols-2',
    layout === 'latest' && 'lg:h-full sm:max-md:grid xl:grid grid-cols-3'
  );

  const imageWrapperStyles = twMerge(
    'relative overflow-hidden rounded-xl',
    layout === 'regular' && 'w-full aspect-[12/10] sm:max-lg:aspect-[11/12] xl:aspect-[11/12]',
    layout === 'promoted' && 'aspect-video',
    layout === 'latest' && 'xl:h-full xl:aspect-[11/12]'
  );

  const contentStyles = twMerge(
    'flex flex-col p-6',
    layout === 'regular' && 'grow space-y-2 col-span-2 mb-1',
    layout === 'promoted' && 'sm:max-lg:col-span-2',
    layout === 'latest' && 'col-span-2'
  );

  const titleStyles = twMerge(
    'text-lg lg:text-xl max-sm:font-sans max-sm:font-semibold font-display transition-colors duration-600 mb-2',
    layout === 'regular' && 'line-clamp-3',
    layout === 'promoted' && 'text-2xl lg:max-xl:text-3xl',
    layout === 'latest' && 'line-clamp-3 text-lg 2xl:text-xl'
  );

  const dateStyles = twMerge(
    'text-xs lg:text-sm text-on-sf-var',
    layout === 'regular' && 'mb-2',
    layout === 'promoted' && 'sm:max-lg:grow',
    layout === 'latest' && 'sm:max-lg:grow xl:grow'
  );

  const descriptionStyles = twMerge(
    'text-sm lg:text-base line-clamp-3 mb-4',
    layout === 'regular' && 'max-sm:hidden',
    layout === 'promoted' && 'xl:grow',
    layout === 'latest' && ''
  );

  const readMoreStyles = 'text-xs lg:text-sm font-medium transition-colors duration-200 flex justify-end items-end text-pr-cont hover:text-pr-fix';

  return (
    <Link href={articleLink} className={containerStyles}>
      <article className={contentWrapperStyles}>
        {/* Image Section - FIXED: Proper Next.js Image implementation */}
        {imageProps && (
          <div className={imageWrapperStyles}>
            <Image
              src={imageProps.src}
              alt={imageProps.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full object-cover"
              priority={layout === 'promoted'}
            />
          </div>
        )}
        
        {/* Content Section */}
        <div className={contentStyles}>
          <h3 className={titleStyles}>
            {translation.title}
          </h3>
          
          <time className={dateStyles}>
            {formattedDate}
          </time>
          
          {translation.excerpt && (
            <p className={descriptionStyles}>
              {translation.excerpt}
            </p>
          )}
          
          <div className={readMoreStyles}>
            <span>{dict.common.readMore}</span>
            <ChevronRightIcon className="ml-1 w-3 h-3" />
          </div>
        </div>
      </article>
    </Link>
  );
}