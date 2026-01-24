// src/main/components/ArticleCards/StandardCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { StandardCardProps, getImageDimensions } from './interfaces';
import { STANDARD_CARD_STYLES } from './articles.styles';
import { ActionLink } from '@/shared/primitives/ActionLink';

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
          
          {translation.description && (
            <p className={cn(
              STANDARD_CARD_STYLES.description.base,
              STANDARD_CARD_STYLES.description[layout]
            )}>
              {translation.description}
            </p>
          )}
          
          {/* Footer: Date + Read More Link */}
          <div className={cn(
            STANDARD_CARD_STYLES.footer.base,
            STANDARD_CARD_STYLES.footer[layout]
          )}>
            <time className={cn(
              STANDARD_CARD_STYLES.date.base,
              STANDARD_CARD_STYLES.date[layout]
            )}>
              {formattedDate}
            </time>
            
            <ActionLink variant="default">
              {dictionary.common.actions.readMore}
            </ActionLink>
          </div>
        </div>
      </article>
    </Link>
  );
}