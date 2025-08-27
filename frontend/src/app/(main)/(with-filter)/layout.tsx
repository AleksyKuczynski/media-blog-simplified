// src/app/[lang]/(main)/(with-filter)/layout.tsx
import FilterGroup from '@/main/components/Navigation/FilterGroup';
import { fetchAllCategories } from '@/main/lib/directus';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';

export default async function WithFilterLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const dict = await getDictionary(lang);
  const categories = await fetchAllCategories(lang);

  return (
    <>
      <FilterGroup
        categories={categories}
        sortingTranslations={dict.sorting}
        categoryTranslations={dict.categories}
        resetText={dict.filter.reset}
        lang={lang}
      />
      {children}
    </>
  );
}