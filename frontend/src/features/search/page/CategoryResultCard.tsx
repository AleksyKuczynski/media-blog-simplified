// src/features/search/page/CategoryResultCard.tsx
import Link from 'next/link';
import { CategorySearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { SEARCH_RESULT_CARD_STYLES } from '../search.styles';
import { processTemplate } from '@/config/i18n/helpers/templates';

interface CategoryResultCardProps {
  category: CategorySearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

const styles = SEARCH_RESULT_CARD_STYLES.category;

export default function CategoryResultCard({ category, lang, dictionary }: CategoryResultCardProps) {
  return (
    <Link
      href={`/${lang}/categories/category=${category.slug}`}
      className={styles.link}
    >
      <div className={styles.container}>
        <h3 className={styles.name}>
          {category.name}
        </h3>
        
        <p className={styles.count}>
          {processTemplate(dictionary.sections.templates.totalCount, {
            count: category.articleCount.toString(),
            countLabel: dictionary.common.count.articles,
          })}
        </p>
      </div>
    </Link>
  );
}