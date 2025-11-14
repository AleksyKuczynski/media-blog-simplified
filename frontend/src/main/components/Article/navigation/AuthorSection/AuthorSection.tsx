// src/main/components/Article/navigation/AuthorSection/AuthorSection.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { DIRECTUS_URL } from '@/main/lib/directus';
import { NAVIGATION_STYLES } from '../../styles';

interface AuthorSectionProps {
  dictionary: Dictionary;
  author: {
    name: string;
    slug: string;
    avatar?: string;
  };
  lang?: string;
  className?: string;
}

/**
 * Author section for article page
 * E-A-T signal (Expertise, Authority, Trust)
 * Links to author profile for entity building
 */
export default function AuthorSection({
  dictionary,
  author,
  lang = 'ru',
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
  
  // Label text for "Автор" or equivalent
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