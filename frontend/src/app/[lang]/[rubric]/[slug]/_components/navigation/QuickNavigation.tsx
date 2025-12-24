// app/[lang]/[rubric]/[slug]/_components/navigation/QuickNavigation.tsx

import Link from 'next/link';
import { Dictionary, Lang } from '@/config/i18n';
import { NAVIGATION_STYLES } from '../article.styles';

export default function QuickNavigation({
  lang,
  dictionary
}: {
  lang: Lang,
  dictionary: Dictionary 
}) {
  const styles = NAVIGATION_STYLES.relatedLinks.quickNav;
  const categoryStyles = NAVIGATION_STYLES.relatedLinks.categoriesAndRubric;
  
  const articlesUrl = `/${lang}/articles`;
  const rubricsUrl = `/${lang}/rubrics`;
  const authorsUrl = `/${lang}/authors`;
  
  const articlesLabel = dictionary.navigation.descriptions.articles;
  const rubricsLabel = dictionary.navigation.descriptions.rubrics;
  const authorsLabel = dictionary.navigation.descriptions.authors;
  
  const headingId = 'quick-nav-heading';

  return (
    <section className={styles.container} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        {dictionary.sections.home.quickNavigation}
      </h2>
      
      <nav className={styles.nav} aria-label={dictionary.sections.home.quickNavigation}>
        <Link 
          href={articlesUrl}
          className={categoryStyles.categoryTag}
          aria-label={articlesLabel}
        >
          {dictionary.sections.labels.articles}
        </Link>
        
        <Link 
          href={rubricsUrl}
          className={categoryStyles.categoryTag}
          aria-label={rubricsLabel}
        >
          {dictionary.sections.labels.rubrics}
        </Link>

        <Link 
          href={authorsUrl}
          className={categoryStyles.categoryTag}
          aria-label={authorsLabel}
        >
          {dictionary.sections.labels.authors}
        </Link>
      </nav>
    </section>
  );
}