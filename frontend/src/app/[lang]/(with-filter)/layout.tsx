// src/app/ru/(with-filter)/layout.tsx
// MIGRATED: Updated to use new dictionary system completely
import FilterGroup from '@/features/navigation/Filter/FilterGroup';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchAllCategories } from '@/api/directus';
import { Suspense } from 'react';

export default async function WithFilterLayout({
  params,
  children,
}: {
   params:  Promise<{ lang: string }> 
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  const categories = await fetchAllCategories(lang as Lang);

  return (
    <>
      <Suspense 
        fallback={<div>Loading...</div>}
      >
        <FilterGroup
          categories={categories}
          dictionary={dictionary}
          lang={lang as Lang}
        />
      </Suspense>      
      {children}
    </>
  );
}