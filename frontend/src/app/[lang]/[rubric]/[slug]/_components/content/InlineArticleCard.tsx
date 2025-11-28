// src/app/[lang]/[rubric]/[slug]/_components/content/InlineArticleCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { ArticleCardData } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/markdownTypes';
import { BLOCKS_STYLES } from '../article.styles';

interface InlineArticleCardProps {
  articleCardData: ArticleCardData;
  lang?: string;
}

const styles = BLOCKS_STYLES.inlineArticleCard;

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
    <div className={styles.container}>
      <Link 
        href={articleLink}
        className={styles.link}
        aria-label={`Read related article: ${title}`}
      >
        <article className={styles.card}>
          {/* Image - Left Side */}
          {imageSrc && (
            <div className={styles.imageContainer}>
              <Image
                src={imageSrc}
                alt={title}
                fill
                className={styles.image}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
              />
            </div>
          )}

          {/* Content - Right Side */}
          <div className={styles.content}>
            {/* Label */}
            <span className={styles.label}>
              Читайте также
            </span>

            {/* Title */}
            <h3 className={styles.title}>
              {title}
            </h3>

            {/* Description - desktop only */}
            {description && (
              <p className={styles.description}>
                {description}
              </p>
            )}

            {/* Date - hidden on mobile */}
            <time 
              dateTime={publishedAt}
              className={styles.date}
            >
              {formattedDate}
            </time>
          </div>
        </article>
      </Link>
    </div>
  );
}