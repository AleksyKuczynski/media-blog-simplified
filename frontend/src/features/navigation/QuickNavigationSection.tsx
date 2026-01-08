// src/features/navigation/QuickNavigationSection.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary, Lang } from '@/config/i18n';

const STYLES = {
  nav: 'flex flex-wrap gap-3 justify-center',
  link: 'inline-flex flex-col items-center gap-2 px-6 py-4 font-medium transition-all duration-200 text-on-sf uppercase',
  icon: 'w-40 h-40 relative',
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
        <div className={STYLES.icon}>
          <Image
            src="/articles.png"
            alt=""
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
        {dictionary.sections.labels.articles}
      </Link>
      
      <Link 
        href={rubricsUrl}
        className={STYLES.link}
        aria-label={rubricsLabel}
      >
        <div className={STYLES.icon}>
          <Image
            src="/articles.png"
            alt=""
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
        {dictionary.sections.labels.rubrics}
      </Link>

      <Link 
        href={authorsUrl}
        className={STYLES.link}
        aria-label={authorsLabel}
      >
        <div className={STYLES.icon}>
          <Image
            src="/articles.png"
            alt=""
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
        {dictionary.sections.labels.authors}
      </Link>
    </nav>
  );
}