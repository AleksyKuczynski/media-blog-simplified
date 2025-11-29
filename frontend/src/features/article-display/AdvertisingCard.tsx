// src/main/components/ArticleCards/AdvertisingCard.tsx

import Link from 'next/link';
import { AdvertisingCardProps } from './interfaces';
import { ADVERTISING_CARD_STYLES } from './styles';

export function AdvertisingCard({ 
  article, 
  articleLink, 
  dictionary 
}: AdvertisingCardProps) {
  const translation = article.translations[0];

  return (
    <article className={ADVERTISING_CARD_STYLES.base}>
      <Link href={articleLink} className={ADVERTISING_CARD_STYLES.link}>
        <div className={ADVERTISING_CARD_STYLES.content}>
          <h2 className={ADVERTISING_CARD_STYLES.title}>
            {translation.title}
          </h2>
          
          {translation.description && (
            <p className={ADVERTISING_CARD_STYLES.description}>
              {translation.description}
            </p>
          )}
          
          <div className={ADVERTISING_CARD_STYLES.buttonContainer}>
            <span className={ADVERTISING_CARD_STYLES.button}>
              {dictionary.common.actions.readMore}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}