// app/[lang]/[rubric]/[slug]/_components/navigation/AuthorSection.tsx
/**
 * Article Navigation - Single Author Card
 * 
 * Server component for single author display.
 * Used by AuthorsSection for multiple authors grid.
 * 
 * Features:
 * - Author avatar
 * - Author name link
 * - Compact card layout
 * - E-A-T signal (Expertise, Authority, Trust)
 * 
 * SEO: Person schema, rel="author" link
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.relatedLinks.author)
 * - Next.js Image for avatar
 * 
 * @param author - Author object with name, slug, avatar
 */

import Link from 'next/link';
import Image from 'next/image';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { DIRECTUS_URL } from '@/main/lib/directus';
import { NAVIGATION_STYLES } from '../article.styles';

interface AuthorSectionProps {
  author: {
    name: string;
    slug: string;
    avatar?: string;
  };
}

/**
 * Author section for article page
 * Static SSR component - imports dictionary directly
 * E-A-T signal (Expertise, Authority, Trust)
 * Links to author profile for entity building
 */
export default function AuthorSection({
  author,
}: AuthorSectionProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.author;
  
  const authorUrl = `/${DEFAULT_LANG}/authors/${author.slug}`;
  
  // Generate aria label
  const ariaLabel = processTemplate(
    dictionary.breadcrumb.templates.authorProfile,
    { name: author.name }
  );
  
  const sectionId = `author-${author.slug}`;
  const headingId = `${sectionId}-heading`;
  
  // Label text for "Автор" or equivalent
  const authorLabel = dictionary.sections.labels.author || 'Автор';

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {authorLabel}
      </h2>
      
      <Link
        href={authorUrl}
        className={styles.link}
        aria-label={ariaLabel}
        rel="author"
      >
        {author.avatar ? (
          <div className={styles.avatar}>
            <Image
              src={`${DIRECTUS_URL}/assets/${author.avatar}`}
              alt={author.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div className={`${styles.avatar} bg-sf-hi flex items-center justify-center`}>
            <span className="text-on-sf font-medium">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className={styles.info}>
          <span className={styles.name}>{author.name}</span>
          <span className={styles.label}>{authorLabel}</span>
        </div>
      </Link>
    </section>
  );
}