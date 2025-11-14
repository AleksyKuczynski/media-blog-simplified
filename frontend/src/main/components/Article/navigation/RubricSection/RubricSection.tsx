// src/main/components/Article/navigation/RubricSection/RubricSection.tsx

import Link from 'next/link';
import Image from 'next/image';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { DIRECTUS_URL } from '@/main/lib/directus';
import { NAVIGATION_STYLES } from '../../styles';

interface RubricSectionProps {
  rubric: {
    slug: string;
    name: string;
    icon?: string;
  };
}

/**
 * Rubric section for article page
 * Static SSR component - imports dictionary directly
 * Primary content classification with icon
 * Strong internal link signal for SEO
 */
export default function RubricSection({
  rubric,
}: RubricSectionProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.rubric;
  
  const rubricUrl = `/${DEFAULT_LANG}/${rubric.slug}`;
  
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