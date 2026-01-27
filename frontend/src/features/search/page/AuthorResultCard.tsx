// src/features/search/page/AuthorResultCard.tsx
import Link from 'next/link';
import { AuthorSearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { SEARCH_RESULT_CARD_STYLES } from '../search.styles';
import { processTemplate } from '@/config/i18n/helpers/templates';

interface AuthorResultCardProps {
  author: AuthorSearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

const styles = SEARCH_RESULT_CARD_STYLES.author;

function getRoleLabel(author: AuthorSearchResult, dictionary: Dictionary): string {
  const isAuthor = author.is_author ?? true; // Default to true if not specified
  const isIllustrator = author.is_illustrator ?? false;
  
  if (isAuthor && isIllustrator) {
    return `${dictionary.sections.labels.author}, ${dictionary.sections.labels.illustrator}`;
  } else if (isIllustrator) {
    return dictionary.sections.labels.illustrator;
  } else {
    return dictionary.sections.labels.author;
  }
}

export default function AuthorResultCard({ author, lang, dictionary }: AuthorResultCardProps) {
  const roleLabel = getRoleLabel(author, dictionary);
  
  return (
    <Link
      href={`/${lang}/authors/${author.slug}`}
      className={styles.link}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge.container}>
            <span className={styles.badge.text}>
              {roleLabel}
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
            {processTemplate(dictionary.sections.templates.totalCount, {
              count: author.articleCount.toString(),
              countLabel: dictionary.common.count.articles,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}