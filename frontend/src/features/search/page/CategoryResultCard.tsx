// src/features/search/page/CategoryResultCard.tsx
import Link from 'next/link';
import { CategorySearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { SEARCH_RESULT_CARD_STYLES } from '../search.styles';

interface CategoryResultCardProps {
  category: CategorySearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

const styles = SEARCH_RESULT_CARD_STYLES.category;

export default function CategoryResultCard({ category, lang, dictionary }: CategoryResultCardProps) {
  return (
    <Link
      href={`/${lang}/articles?category=${category.slug}`}
      className={styles.link}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge.container}>
            <span className={styles.badge.text}>
              {dictionary.sections.labels.categories}
            </span>
          </div>
          
          <h3 className={styles.name}>
            {category.name}
          </h3>
          
          <p className={styles.count}>
            {category.articleCount} {dictionary.common.count.articles}
          </p>
        </div>
      </div>
    </Link>
  );
}