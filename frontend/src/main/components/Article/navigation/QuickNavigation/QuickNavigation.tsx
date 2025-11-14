// src/main/components/Article/navigation/QuickNavigation/QuickNavigation.tsx

import Link from 'next/link';
import { Dictionary } from '@/main/lib/dictionary';
import { NAVIGATION_STYLES } from '../../styles';

interface QuickNavigationProps {
  dictionary: Dictionary;
  rubricSlug: string;
  lang?: string;
  className?: string;
}

/**
 * Quick navigation links for article page
 * Provides internal site structure links for SEO and UX
 * Implements SiteNavigationElement schema
 */
export default function QuickNavigation({
  dictionary,
  rubricSlug,
  lang = 'ru',
  className,
}: QuickNavigationProps) {
  const styles = NAVIGATION_STYLES.relatedLinks.quickNav;
  
  const articlesUrl = `/${lang}/articles`;
  const rubricsUrl = `/${lang}/rubrics`;
  
  // Generate aria labels
  const articlesLabel = dictionary.navigation.descriptions.articles;
  const rubricsLabel = dictionary.navigation.descriptions.rubrics;
  
  const navId = `quick-nav-${rubricSlug}`;
  const headingId = `${navId}-heading`;

  return (
    <section className={className || styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {dictionary.sections.home.quickNavigation}
      </h2>
      
      <nav className={styles.nav} aria-label={ dictionary.sections.home.quickNavigation}>
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