// src/app/[lang]/[rubric]/[slug]/_components/navigation//QuickNavigation.tsx

import Link from 'next/link';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { NAVIGATION_STYLES } from '../article.styles';

/**
 * Quick navigation links for article page
 * Static SSR component - no props needed
 * Provides internal site structure links for SEO and UX
 * Implements SiteNavigationElement schema
 */
export default function QuickNavigation({
  lang,
  dictionary
}: {
  lang: Lang,
  dictionary: Dictionary 
}) {
  const styles = NAVIGATION_STYLES.relatedLinks.quickNav;
  
  const articlesUrl = `/${lang}/articles`;
  const rubricsUrl = `/${lang}/rubrics`;
  
  // Generate aria labels
  const articlesLabel = dictionary.navigation.descriptions.articles;
  const rubricsLabel = dictionary.navigation.descriptions.rubrics;
  
  const headingId = 'quick-nav-heading';

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {dictionary.sections.home.quickNavigation}
      </h2>
      
      <nav className={styles.nav} aria-label={dictionary.sections.home.quickNavigation}>
        <Link 
          href={articlesUrl}
          className={styles.link}
          aria-label={articlesLabel}
        >
          {dictionary.sections.labels.articles}
        </Link>
        
        <Link 
          href={rubricsUrl}
          className={styles.link}
          aria-label={rubricsLabel}
        >
          {dictionary.sections.labels.rubrics}
        </Link>
      </nav>
    </section>
  );
}