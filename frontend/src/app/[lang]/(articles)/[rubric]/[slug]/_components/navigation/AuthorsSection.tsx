// app/[lang]/[rubric]/[slug]/_components/navigation/AuthorsSection.tsx
/**
 * Article Navigation - Authors Grid
 * 
 * Server component handling multiple article authors.
 * Filters editorial placeholders, renders author cards.
 * 
 * Features:
 * - Grid layout for multiple authors
 * - Editorial author filtering
 * - Conditional rendering
 * - E-A-T signal multiplier
 * 
 * SEO: Multiple Person schemas
 * Each author gets own Person schema and rel="author" link
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.relatedLinks.authors)
 * - AuthorSection.tsx (individual cards)
 * - @/main/lib/dictionary (Dictionary)
 * 
 * @param authors - Array of author objects
 * @param className - Optional container class
 * @param dictionary - Translations
 */

import { Dictionary } from '@/config/i18n';
import { NAVIGATION_STYLES } from '../article.styles';
import AuthorSection from './AuthorSection';

interface AuthorsSectionProps {
  authors: Array<{
    name: string;
    slug: string;
    avatar?: string;
  }>;
  className?: string;
  dictionary: Dictionary;
}

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
            dictionary={dictionary} 
            key={author.slug} 
            author={author}
          />
        ))}
      </div>
    </section>
  );
}