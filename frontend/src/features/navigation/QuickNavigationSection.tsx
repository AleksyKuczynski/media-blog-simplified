// src/features/navigation/QuickNavigationSection.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary, Lang } from '@/config/i18n';
import { cn } from '@/lib/utils';

const STYLES = {
  nav: 'flex flex-wrap gap-2 md:gap-8 lg:gap-12 xl:gap-16 justify-center',
  link: cn(
    'inline-flex flex-col items-center gap-2',
    'text-pr-cont font-medium uppercase xl:text-lg', 
    'px-4 md:px-8 py-2 md:py-4 border border-transparent rounded-xl md:rounded-3xl', 
    'hover:shadow-xl hover:border-ol-var transition-all duration-200', 
  ),
  icon: 'w-16 md:w-20 xl:w-24 aspect-square relative',
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
            className="object-cover"
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
            className="object-cover"
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
            className="object-cover"
            sizes="48px"
          />
        </div>
        {dictionary.sections.labels.authors}
      </Link>
    </nav>
  );
}