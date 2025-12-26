// src/features/shared/CardCarousel/cards/AuthorCarouselCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/config/i18n';
import { AUTHOR_CAROUSEL_CARD_STYLES } from './styles';

interface AuthorCarouselCardProps {
  slug: string;
  name: string;
  bio?: string;
  avatarSrc?: string;
  url: string;
  dictionary: Dictionary;
}

export default function AuthorCarouselCard({
  slug,
  name,
  bio,
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
                sizes="56px"
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
            {bio && (
              <p className={AUTHOR_CAROUSEL_CARD_STYLES.bio}>
                {bio}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}