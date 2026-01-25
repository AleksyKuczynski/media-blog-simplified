// src/features/search/page/AuthorResultCard.tsx
import Link from 'next/link';
import { AuthorSearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { SEARCH_RESULT_CARD_STYLES } from '../search.styles';

interface AuthorResultCardProps {
  author: AuthorSearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

const styles = SEARCH_RESULT_CARD_STYLES.author;

export default function AuthorResultCard({ author, lang, dictionary }: AuthorResultCardProps) {
  return (
    <Link
      href={`/${lang}/authors/${author.slug}`}
      className={styles.link}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge.container}>
            <span className={styles.badge.text}>
              {dictionary.sections.labels.author}
            </span>
          </div>
          
          <h3 className={styles.name}>
            {author.name}
          </h3>
          
          {author.bio && (
            <p className={styles.bio}>
              {author.bio}
            </p>
          )}
          
          <p className={styles.count}>
            {author.articleCount} {dictionary.common.count.articles}
          </p>
        </div>
      </div>
    </Link>
  );
}