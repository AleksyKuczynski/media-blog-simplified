// src/features/navigation/QuickNavigationSection.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Dictionary, Lang } from '@/config/i18n';
import { QUICK_NAV_STYLES } from './styles';

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
  
  const styles = QUICK_NAV_STYLES;

  const articlesLabel = dictionary.navigation.descriptions.articles;
  const rubricsLabel = dictionary.navigation.descriptions.rubrics;
  const authorsLabel = dictionary.navigation.descriptions.authors;

  return (
    <nav className={styles.nav} aria-label={dictionary.sections.home.quickNavigation}>
      <Link 
        href={articlesUrl}
        className={styles.link}
        aria-label={articlesLabel}
      >
        <div className={styles.icon}>
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
        className={styles.link}
        aria-label={rubricsLabel}
      >
        <div className={styles.icon}>
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
        className={styles.link}
        aria-label={authorsLabel}
      >
        <div className={styles.icon}>
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