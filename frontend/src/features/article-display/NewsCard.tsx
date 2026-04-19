// src/main/components/ArticleCards/NewsCard.tsx

import { NewsCardProps } from './interfaces';
import { NEWS_CARD_STYLES } from './articles.styles';
import { ArticleLink } from './ArticleLink';

export function NewsCard({ 
  article, 
  formattedDate, 
  articleLink, 
  dictionary,
  fromContext 
}: NewsCardProps) {
  const translation = article.translations[0];

  return (
    <article className={NEWS_CARD_STYLES.base}>
      <ArticleLink href={articleLink} fromContext={fromContext} className={NEWS_CARD_STYLES.link}>
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
      </ArticleLink>
    </article>
  );
}