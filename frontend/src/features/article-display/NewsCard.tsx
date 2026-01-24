// src/main/components/ArticleCards/NewsCard.tsx

import Link from 'next/link';
import { NewsCardProps } from './interfaces';
import { NEWS_CARD_STYLES } from './articles.styles';

export function NewsCard({ 
  article, 
  formattedDate, 
  articleLink, 
  dictionary 
}: NewsCardProps) {
  const translation = article.translations[0];

  return (
    <article className={NEWS_CARD_STYLES.base}>
      <Link href={articleLink} className={NEWS_CARD_STYLES.link}>
        <h2 className={NEWS_CARD_STYLES.title}>
          {translation.title}
        </h2>
        
        <p className={NEWS_CARD_STYLES.date}>
          {formattedDate}
        </p>
        
        <p className={NEWS_CARD_STYLES.description}>
          {translation.description}
        </p>
        
        <div className={NEWS_CARD_STYLES.readMoreContainer}>
          <span className={NEWS_CARD_STYLES.readMore}>
            {dictionary.common.actions.readMore}
          </span>
        </div>
      </Link>
    </article>
  );
}