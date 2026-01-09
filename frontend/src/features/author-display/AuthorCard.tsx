// src/main/components/Main/AuthorCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { DIRECTUS_URL, AuthorDetails } from '@/api/directus';
import { Lang } from '@/config/i18n';
import { AUTHOR_CARD_STYLES } from './styles';

interface AuthorCardProps {
  author: AuthorDetails;
  linkToProfile?: boolean;
  lang: Lang;
}

export default function AuthorCard({ author, linkToProfile = true, lang }: AuthorCardProps) {
  const CardContent = () => (
    <div className={AUTHOR_CARD_STYLES.container}>
      {/* Avatar Section */}
      <div className={AUTHOR_CARD_STYLES.avatarContainer}>
        {author.avatar ? (
          <Image
            src={`${DIRECTUS_URL}/assets/${author.avatar}?width=400&height=400&quality=80&format=webp`}
            alt={author.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={AUTHOR_CARD_STYLES.avatarImage}
          />
        ) : (
          <div className={AUTHOR_CARD_STYLES.avatarFallback}>
            <span className={AUTHOR_CARD_STYLES.avatarFallbackText}>
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
        
      <div className={AUTHOR_CARD_STYLES.grid}>
        {/* Author Name */}
        <h3 className={AUTHOR_CARD_STYLES.name}>
          {author.name}
        </h3>
        
        {/* Bio */}
        {author.bio && (
          <p className={AUTHOR_CARD_STYLES.bio}>
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );

  if (linkToProfile) {
    return (
      <Link href={`/${lang}/authors/${author.slug}`} className={AUTHOR_CARD_STYLES.link}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}