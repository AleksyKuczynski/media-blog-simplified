// frontend/src/features/navigation/QuickNavigationSection.tsx
import { Dictionary, Lang } from '@/config/i18n';
import { QUICK_NAV_STYLES } from './styles';
import QuickNavButton from './QuickNavButton';

export default function QuickNavigationSection({
  lang,
  dictionary
}: {
  lang: Lang,
  dictionary: Dictionary 
}) {
  return (
    <nav className={QUICK_NAV_STYLES.nav} aria-label={dictionary.sections.home.quickNavigation}>
      <QuickNavButton
        type="articles"
        href={`/${lang}/articles`}
        label={dictionary.sections.labels.articles}
        ariaLabel={dictionary.navigation.descriptions.articles}
      />
      
      <QuickNavButton
        type="rubrics"
        href={`/${lang}/rubrics`}
        label={dictionary.sections.labels.rubrics}
        ariaLabel={dictionary.navigation.descriptions.rubrics}
      />

      <QuickNavButton
        type="authors"
        href={`/${lang}/authors`}
        label={dictionary.sections.labels.authors}
        ariaLabel={dictionary.navigation.descriptions.authors}
      />
    </nav>
  );
}