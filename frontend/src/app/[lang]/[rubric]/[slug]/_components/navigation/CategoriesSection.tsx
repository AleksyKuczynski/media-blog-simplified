// app/[lang]/[rubric]/[slug]/_components/navigation/CategoriesSection.tsx
/**
 * Article Navigation - Category Tags
 * 
 * Server component displaying article categories as horizontal tags.
 * Enhances topical relevance signals for SEO.
 * 
 * Features:
 * - Horizontal tag layout
 * - Links to category filter pages
 * - Conditional rendering (empty state)
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.relatedLinks.categories)
 * - @/main/lib/dictionary (Dictionary, Lang, processTemplate)
 * 
 * @param categories - Array of category objects
 * @param lang - Language code
 * @param dictionary - Translations
 */

import Link from 'next/link';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { Dictionary, Lang } from '@/config/i18n';
import { NAVIGATION_STYLES } from '../article.styles';

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