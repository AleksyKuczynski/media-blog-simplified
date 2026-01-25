// app/[lang]/[rubric]/[slug]/_components/navigation/CategoriesAndRubricSection.tsx
/**
 * Article Navigation - Combined Categories and Rubric Section
 * 
 * Server component displaying article categories and rubric in a unified layout.
 * - Mobile: Rubric below category tags (flex-col)
 * - Desktop: Rubric inline with categories (flex-row)
 * 
 * Features:
 * - Horizontal category tags (preserved design)
 * - Rubric link with icon and name
 * - Responsive layout
 * - Conditional rendering for empty states
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.relatedLinks.categoriesAndRubric)
 * - Next.js Image for rubric icon
 * - @/api/directus (DIRECTUS_URL)
 */

import Link from 'next/link';
import Image from 'next/image';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { DIRECTUS_URL } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { NAVIGATION_STYLES } from '../article.styles';

interface CategoriesAndRubricSectionProps {
  categories: Array<{
    slug: string;
    name: string;
  }>;
  rubric: {
    slug: string;
    name: string;
    icon?: string;
  };
  lang: Lang;
  dictionary: Dictionary;
}

export default function CategoriesAndRubricSection({
  categories,
  rubric,
  lang,
  dictionary
}: CategoriesAndRubricSectionProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.categoriesAndRubric;
  
  const sectionId = `categories-rubric-${rubric.slug}`;
  const headingId = `${sectionId}-heading`;
  
  // Generate heading text
  const headingText = dictionary.navigation.accessibility.pageNavigation;
  
  // Generate rubric link labels
  const rubricUrl = `/${lang}/${rubric.slug}`;
  const rubricAriaLabel = processTemplate(
    dictionary.sections.templates.itemInCollection,
    {
      item: dictionary.sections.labels.articles,
      collection: rubric.name,
    }
  );
  
  const iconAlt = rubric.icon 
    ? processTemplate(dictionary.sections.rubrics.rubricIcon, { name: rubric.name })
    : '';

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {headingText}
      </h2>
      
      <div className={styles.wrapper}>       
        {/* Rubric - similar to author section design */}
        <Link
          href={rubricUrl}
          className={styles.rubricLink}
          aria-label={rubricAriaLabel}
        >
          {rubric.icon && (
            <div className={styles.rubricIcon}>
              <Image
                src={`${DIRECTUS_URL}/assets/${rubric.icon}`}
                alt={iconAlt}
                fill
                className="object-contain"
                sizes="24px"
              />
            </div>
          )}
          <span className={styles.rubricText}>{rubric.name}</span>
        </Link>

        {/* Categories - flex-wrap allows multiple rows */}
        {categories.length > 0 && (
          <nav 
            className={styles.categoriesNav}
            aria-label={dictionary.sections.labels.categories}
          >
            {categories.map((category) => {
              const categoryUrl = `/${lang}/categories/${category.slug}`;
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
                  className={styles.categoryTag}
                  aria-label={ariaLabel}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </section>
  );
}