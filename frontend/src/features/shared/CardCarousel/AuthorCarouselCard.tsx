// src/features/shared/CardCarousel/cards/AuthorCarouselCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/config/i18n';
import { AUTHOR_CAROUSEL_CARD_STYLES } from './carousel.styles';
import CollectionCount from '@/features/layout/CollectionCount';

interface AuthorCarouselCardProps {
  slug: string;
  name: string;
  count?: number;
  avatarSrc?: string;
  url: string;
  dictionary: Dictionary;
}

export default function AuthorCarouselCard({
  name,
  count,
  avatarSrc,
  url,
  dictionary
}: AuthorCarouselCardProps) {
  const profileText = `${dictionary.sections.authors.profileDescription} ${name}`;

  return (
    <Link 
      href={url} 
      className={AUTHOR_CAROUSEL_CARD_STYLES.container}
      aria-label={profileText}
    >
      <article className={AUTHOR_CAROUSEL_CARD_STYLES.card}>
        <div className={AUTHOR_CAROUSEL_CARD_STYLES.content}>
          {/* Avatar */}
          {avatarSrc ? (
            <div className={AUTHOR_CAROUSEL_CARD_STYLES.avatarWrapper}>
              <Image
                src={avatarSrc}
                alt={name}
                fill
                className={AUTHOR_CAROUSEL_CARD_STYLES.avatarImage}
                sizes="480px"
              />
            </div>
          ) : (
            <div className={AUTHOR_CAROUSEL_CARD_STYLES.avatarFallback}>
              <span className={AUTHOR_CAROUSEL_CARD_STYLES.avatarFallbackText}>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Text */}
          <div className={AUTHOR_CAROUSEL_CARD_STYLES.textContent}>
            <h3 className={AUTHOR_CAROUSEL_CARD_STYLES.name}>
              {name}
            </h3>
            {count !== undefined && count > 0 && (
              <CollectionCount
                count={count}
                countLabel={dictionary.common.count.articles}
                dictionary={dictionary}
                className={AUTHOR_CAROUSEL_CARD_STYLES.count}
              />
            )}            
          </div>
        </div>
      </article>
    </Link>
  );
}