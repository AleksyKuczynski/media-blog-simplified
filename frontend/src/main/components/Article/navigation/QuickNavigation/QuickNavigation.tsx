// src/main/components/Article/navigation/QuickNavigation/QuickNavigation.tsx

import Link from 'next/link';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { NAVIGATION_STYLES } from '../../styles';

/**
 * Quick navigation links for article page
 * Static SSR component - no props needed
 * Provides internal site structure links for SEO and UX
 * Implements SiteNavigationElement schema
 */
export default function QuickNavigation() {
  const styles = NAVIGATION_STYLES.relatedLinks.quickNav;
  
  const articlesUrl = `/${DEFAULT_LANG}/articles`;
  const rubricsUrl = `/${DEFAULT_LANG}/rubrics`;
  
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