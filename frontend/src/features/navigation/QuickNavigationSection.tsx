// src/features/navigation/QuickNavigationSection.tsx

import Link from 'next/link';
import { Dictionary, Lang } from '@/config/i18n';

const STYLES = {
  nav: 'flex flex-wrap gap-3 justify-center',
  link: 'inline-flex items-center px-6 py-3 bg-sf-hi hover:bg-pr-cont hover:text-on-pr rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-on-sf',
} as const;

export default function QuickNavigationSection({
  lang,
  dictionary
}: {
  lang: Lang,
  dictionary: Dictionary 
}) {
  const articlesUrl = `/${lang}/articles`;
  const rubricsUrl = `/${lang}/rubrics`;
  const authorsUrl = `/${lang}/authors`;
  
  const articlesLabel = dictionary.navigation.descriptions.articles;
  const rubricsLabel = dictionary.navigation.descriptions.rubrics;
  const authorsLabel = dictionary.navigation.descriptions.authors;

  return (
    <nav className={STYLES.nav} aria-label={dictionary.sections.home.quickNavigation}>
      <Link 
        href={articlesUrl}
        className={STYLES.link}
        aria-label={articlesLabel}
      >
        {dictionary.sections.labels.articles}
      </Link>
      
      <Link 
        href={rubricsUrl}
        className={STYLES.link}
        aria-label={rubricsLabel}
      >
        {dictionary.sections.labels.rubrics}
      </Link>

      <Link 
        href={authorsUrl}
        className={STYLES.link}
        aria-label={authorsLabel}
      >
        {dictionary.sections.labels.authors}
      </Link>
    </nav>
  );
}