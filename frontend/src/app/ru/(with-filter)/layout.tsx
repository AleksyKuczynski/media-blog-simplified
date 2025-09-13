// src/app/ru/(with-filter)/layout.tsx
// MIGRATED: Updated to use new dictionary system completely
import FilterGroup from '@/main/components/Navigation/FilterGroup';
import { fetchAllCategories } from '@/main/lib/directus';
import { getDictionary } from '@/main/lib/dictionary/dictionary'; // MIGRATED: Use new dictionary

export default async function WithFilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary('ru'); // MIGRATED: New dictionary system
  const categories = await fetchAllCategories('ru');

  return (
    <>
      {/* MIGRATED: FilterGroup with full dictionary */}
      <FilterGroup
        categories={categories}
        dictionary={dictionary}  // MIGRATED: Pass full dictionary
        lang="ru"
      />
      {children}
    </>
  );
}