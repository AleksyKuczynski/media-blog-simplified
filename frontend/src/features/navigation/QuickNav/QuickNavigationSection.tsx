// frontend/src/features/navigation/QuickNav/QuickNavigationSection.tsx
'use client'

import { usePathname } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { QUICK_NAV_STYLES } from '../navigation.styles';
import QuickNavButton from './QuickNavButton';

interface QuickNavigationSectionProps {
  lang: Lang;
  dictionary: Dictionary;
}

export default function QuickNavigationSection({
  lang,
  dictionary
}: QuickNavigationSectionProps) {
  const pathname = usePathname();
  
  // Determine which buttons to show based on current page
  const showHome = !pathname.endsWith(`/${lang}`);
  const showArticles = !pathname.includes('/articles');
  const showRubrics = !pathname.includes('/rubrics');
  const showAuthors = !pathname.includes('/authors');

  return (
    <nav className={QUICK_NAV_STYLES.nav} aria-label={dictionary.sections.home.quickNavigation}>
      {showHome && (
        <QuickNavButton
          type="home"
          href={`/${lang}`}
          label={dictionary.navigation.labels.home}
          ariaLabel={dictionary.navigation.descriptions.home}
        />
      )}
      
      {showArticles && (
        <QuickNavButton
          type="articles"
          href={`/${lang}/articles`}
          label={dictionary.sections.labels.articles}
          ariaLabel={dictionary.navigation.descriptions.articles}
        />
      )}
      
      {showRubrics && (
        <QuickNavButton
          type="rubrics"
          href={`/${lang}/rubrics`}
          label={dictionary.sections.labels.rubrics}
          ariaLabel={dictionary.navigation.descriptions.rubrics}
        />
      )}

      {showAuthors && (
        <QuickNavButton
          type="authors"
          href={`/${lang}/authors`}
          label={dictionary.sections.labels.authors}
          ariaLabel={dictionary.navigation.descriptions.authors}
        />
      )}
    </nav>
  );
}