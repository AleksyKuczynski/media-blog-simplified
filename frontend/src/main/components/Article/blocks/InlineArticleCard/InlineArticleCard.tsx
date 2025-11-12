// src/main/components/Article/blocks/InlineArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { ArticleCardData } from '@/main/lib/markdown/markdownTypes';
import { BLOCKS_STYLES } from '@/main/components/Article/styles';

interface InlineArticleCardProps {
  articleCardData: ArticleCardData;
  lang?: string;
}

export default function InlineArticleCard({
  articleCardData,
  lang = 'ru'
}: InlineArticleCardProps) {
  const {
    slug,
    title,
    description,
    imageSrc,
    rubricSlug,
    publishedAt
  } = articleCardData;
  
  const articleLink = `/${lang}/${rubricSlug}/${slug}`;
  
  const formattedDate = new Date(publishedAt).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={BLOCKS_STYLES.inlineArticleCard.container}>
      <Link 
        href={articleLink}
        className={BLOCKS_STYLES.inlineArticleCard.link}
        aria-label={`Read related article: ${title}`}
      >
        <article className={BLOCKS_STYLES.inlineArticleCard.card}>
          {/* Image - Left Side */}
          {imageSrc && (
            <div className={BLOCKS_STYLES.inlineArticleCard.imageContainer}>
              <Image
                src={imageSrc}
                alt={title}
                fill
                className={BLOCKS_STYLES.inlineArticleCard.image}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
              />
            </div>
          )}

          {/* Content - Right Side */}
          <div className={BLOCKS_STYLES.inlineArticleCard.content}>
            {/* Label */}
            <span className={BLOCKS_STYLES.inlineArticleCard.label}>
              Читайте также
            </span>

            {/* Title */}
            <h3 className={BLOCKS_STYLES.inlineArticleCard.title}>
              {title}
            </h3>

            {/* Description - desktop only */}
            {description && (
              <p className={BLOCKS_STYLES.inlineArticleCard.description}>
                {description}
              </p>
            )}

            {/* Date - hidden on mobile */}
            <time 
              dateTime={publishedAt}
              className={BLOCKS_STYLES.inlineArticleCard.date}
            >
              {formattedDate}
            </time>
          </div>
        </article>
      </Link>
    </div>
  );
}