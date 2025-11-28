// app/[lang]/[rubric]/[slug]/_components/navigation/RubricSection.tsx
/**
 * Article Navigation - Rubric Display
 * 
 * Server component showing article rubric with icon and link.
 * Single rubric per article.
 * 
 * Features:
 * - Rubric icon from Directus
 * - Link to rubric page
 * - Compact inline display
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.relatedLinks.rubric)
 * - @/main/lib/directus (DIRECTUS_URL)
 * - Next.js Image for icon
 * 
 * @param rubric - Rubric object with name, slug, icon
 * @param lang - Language code
 */

import Link from 'next/link';
import Image from 'next/image';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { DIRECTUS_URL } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { NAVIGATION_STYLES } from '../article.styles';

interface RubricSectionProps {
  rubric: {
    slug: string;
    name: string;
    icon?: string;
  };
  lang: Lang;
  dictionary: Dictionary; 
}

/**
 * Rubric section for article page
 * Static SSR component - imports dictionary directly
 * Primary content classification with icon
 * Strong internal link signal for SEO
 */
export default function RubricSection({
  rubric,
  lang,
  dictionary
}: RubricSectionProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.rubric;
  
  const rubricUrl = `/${lang}/${rubric.slug}`;
  
  // Generate aria label
  const ariaLabel = processTemplate(
    dictionary.sections.templates.itemInCollection,
    {
      item: dictionary.sections.labels.articles,
      collection: rubric.name,
    }
  );
  
  // Generate icon alt text
  const iconAlt = processTemplate(
    dictionary.sections.rubrics.rubricIcon,
    { name: rubric.name }
  );
  
  const sectionId = `rubric-${rubric.slug}`;
  const headingId = `${sectionId}-heading`;

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {dictionary.sections.labels.rubrics}
      </h2>
      
      <Link
        href={rubricUrl}
        className={styles.link}
        aria-label={ariaLabel}
      >
        {rubric.icon && (
          <div className={styles.icon}>
            <Image
              src={`${DIRECTUS_URL}/assets/${rubric.icon}`}
              alt={iconAlt}
              fill
              className="object-contain"
              sizes="24px"
            />
          </div>
        )}
        <span className={styles.text}>{rubric.name}</span>
      </Link>
    </section>
  );
}