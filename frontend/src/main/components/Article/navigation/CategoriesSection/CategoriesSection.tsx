// src/main/components/Article/navigation/CategoriesSection/CategoriesSection.tsx

import Link from 'next/link';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { NAVIGATION_STYLES } from '../../styles';

interface CategoriesSectionProps {
  dictionary: Dictionary;
  categories: Array<{
    slug: string;
    name: string;
  }>;
  lang?: string;
  className?: string;
}

/**
 * Categories section for article page
 * Displays topic taxonomy as compact horizontal tags
 * Enhances topical relevance signals for SEO
 */
export default function CategoriesSection({
  dictionary,
  categories,
  lang = 'ru',
  className,
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
    { section: dictionary.sections.labels.categories }
  );

  return (
    <section className={className || styles.container} aria-labelledby={headingId}>
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