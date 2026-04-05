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
import { Dictionary, Lang } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { DIRECTUS_ASSETS_URL } from '@/api/directus';
import { NAVIGATION_STYLES } from '../article.styles';

interface AuthorSectionProps {
  dictionary: Dictionary
  lang: Lang;
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
  dictionary,
  lang,
  author,
}: AuthorSectionProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.author;
  
  const authorUrl = `/${lang}/authors/${author.slug}`;
  
  // Generate aria label
  const ariaLabel = processTemplate(
    dictionary.breadcrumb.templates.authorProfile,
    { name: author.name }
  );
  
  const sectionId = `author-${author.slug}`;
  const headingId = `${sectionId}-heading`;
  const authorLabel = dictionary.sections.labels.author;

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
              src={`${DIRECTUS_ASSETS_URL}/assets/${author.avatar}?width=128&height=128&quality=90&format=webp`}
              alt={author.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 64px, 48px"
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
          <span className={styles.label}>{dictionary.sections.labels.author}</span>
        </div>
      </Link>
    </section>
  );
}