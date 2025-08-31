// src/app/ru/(with-filter)/layout.tsx
import FilterGroup from '@/main/components/Navigation/FilterGroup';
import { fetchAllCategories } from '@/main/lib/directus';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';

export default async function WithFilterLayout({
  children,
}: {
  children: React.ReactNode;
  // ✅ REMOVED: params: { lang: Lang } - no longer expected in static routes
}) {
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  const categories = await fetchAllCategories('ru'); // ✅ HARDCODED: Russian language

  return (
    <>
      <FilterGroup
        categories={categories}
        sortingTranslations={dict.sorting}
        categoryTranslations={dict.categories}
        resetText={dict.filter.reset}
        lang="ru" // ✅ HARDCODED: Russian language
      />
      {children}
    </>
  );
}