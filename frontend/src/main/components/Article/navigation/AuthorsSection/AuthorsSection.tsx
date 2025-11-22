// src/main/components/Article/navigation/AuthorsSection/AuthorsSection.tsx

import { Dictionary } from '@/main/lib/dictionary';
import { NAVIGATION_STYLES } from '../../styles';
import AuthorSection from '../AuthorSection/AuthorSection';

interface AuthorsSectionProps {
  authors: Array<{
    name: string;
    slug: string;
    avatar?: string;
  }>;
  className?: string;
  dictionary: Dictionary;
}

/**
 * Authors section for article page - handles multiple authors
 * Static SSR component - imports dictionary directly
 * E-A-T signal multiplier (Expertise, Authority, Trust)
 * Each author gets own Person schema and rel="author" link
 */
export default function AuthorsSection({
  authors,
  className,
  dictionary
}: AuthorsSectionProps) {
  // Filter out editorial/placeholder authors
  const realAuthors = authors.filter(
    author => author.slug && author.name !== '::EDITORIAL::'
  );

  if (realAuthors.length === 0) {
    return null;
  }

  const styles = NAVIGATION_STYLES.relatedLinks.authors;
  const headingId = 'authors-section-heading';
  
  // Label text
  const authorsLabel = realAuthors.length === 1 
    ? dictionary.sections.labels.author 
    : dictionary.sections.labels.authors || 'Авторы';

  return (
    <section className={className || styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        {authorsLabel}
      </h2>
      
      <div className={styles.grid}>
        {realAuthors.map((author) => (
          <AuthorSection 
            key={author.slug} 
            author={author}
          />
        ))}
      </div>
    </section>
  );
}