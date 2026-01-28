// src/features/shared/CardCarousel/cards/ArticleCarouselCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Lang } from '@/config/i18n';
import { ARTICLE_CAROUSEL_CARD_STYLES } from './carousel.styles';

interface ArticleCarouselCardProps {
  slug: string;
  title: string;
  publishedAt: string;
  imageSrc?: string;
  rubricSlug: string;
  formattedDate: string;
  lang: Lang;
}

export default function ArticleCarouselCard({
  slug,
  title,
  publishedAt,
  imageSrc,
  rubricSlug,
  formattedDate,
  lang
}: ArticleCarouselCardProps) {
  const articleLink = `/${lang}/${rubricSlug}/${slug}`;

  return (
    <Link 
      href={articleLink} 
      className={ARTICLE_CAROUSEL_CARD_STYLES.container}
      aria-label={`Read article: ${title}`}
    >
      <article className={ARTICLE_CAROUSEL_CARD_STYLES.card}>
        {imageSrc && (
          <div className={ARTICLE_CAROUSEL_CARD_STYLES.imageContainer}>
            <Image
              src={imageSrc}
              alt={title}
              fill
              className={ARTICLE_CAROUSEL_CARD_STYLES.image}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 320px"
            />
          </div>
        )}

        <div className={ARTICLE_CAROUSEL_CARD_STYLES.content}>
          <h3 className={ARTICLE_CAROUSEL_CARD_STYLES.title}>
            {title}
          </h3>

          <time 
            dateTime={publishedAt}
            className={ARTICLE_CAROUSEL_CARD_STYLES.date}
          >
            {formattedDate}
          </time>
        </div>
      </article>
    </Link>
  );
}