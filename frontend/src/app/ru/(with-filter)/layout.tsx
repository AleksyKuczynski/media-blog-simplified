// src/app/ru/(with-filter)/layout.tsx
// MIGRATED: Updated to use new dictionary system completely
import FilterGroup from '@/main/components/Navigation/FilterGroup';
import getDictionary from '@/main/lib/dictionary/getDictionary';
import { fetchAllCategories } from '@/main/lib/directus';
import { Suspense } from 'react';

export default async function WithFilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary('ru'); // MIGRATED: New dictionary system
  const categories = await fetchAllCategories('ru');

  return (
    <>
      <Suspense 
        fallback={
          <div 
            className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"
            role="status"
            aria-label="Загрузка фильтров"
          >
            {/* Category dropdown skeleton */}
            <div className="flex flex-col">
              <div className="mb-2 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            
            {/* Sort dropdown skeleton */}
            <div className="flex flex-col">
              <div className="mb-2 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            
            {/* Reset button skeleton */}
            <div className="flex flex-col justify-end">
              <div className="h-10 w-full sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>

            <span className="sr-only">Загрузка фильтров...</span>
          </div>
        }
      >
        <FilterGroup
          categories={categories}
          dictionary={dictionary}
          lang="ru"
        />
      </Suspense>      
      {children}
    </>
  );
}