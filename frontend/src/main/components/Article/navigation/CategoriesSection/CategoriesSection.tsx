// src/main/components/Article/navigation/CategoriesSection/CategoriesSection.tsx

import Link from 'next/link';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { NAVIGATION_STYLES } from '../../styles';
import { Dictionary, Lang } from '@/main/lib/dictionary';

interface CategoriesSectionProps {
  categories: Array<{
    slug: string;
    name: string;
  }>;
  lang: Lang;
  dictionary: Dictionary;
}

/**
 * Categories section for article page
 * Static SSR component - imports dictionary directly
 * Displays topic taxonomy as compact horizontal tags
 * Enhances topical relevance signals for SEO
 */
export default function CategoriesSection({
  categories,
  lang,
  dictionary
}: CategoriesSectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const styles = NAVIGATION_STYLES.relatedLinks.categories;
  
  const navId = `categories-${categories.map(c => c.slug).join('-')}`;
  const headingId = `${navId}-heading`;
  
  // Generate heading text
  const headingText = processTemplate(
    dictionary.sections.templates.collectionTitle,
    { section: dictionary.sections.labels.categories || 'Категории' }
  );

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {headingText}
      </h2>
      
      <nav className={styles.nav} aria-label={headingText}>
        {categories.map((category) => {
          const categoryUrl = `/${lang}/category/${category.slug}`;
          
          // Generate aria label for each category
          const ariaLabel = processTemplate(
            dictionary.sections.templates.itemInCollection,
            {
              item: dictionary.sections.labels.articles,
              collection: category.name,
            }
          );

          return (
            <Link
              key={category.slug}
              href={categoryUrl}
              className={styles.tag}
              aria-label={ariaLabel}
            >
              {category.name}
            </Link>
          );
        })}
      </nav>
    </section>
  );
}