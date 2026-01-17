// src/app/[lang]/(with-filter)/layout.tsx
import { Suspense } from 'react';
import { Lang, getDictionary } from '@/config/i18n';
import { fetchAllCategories } from '@/api/directus';
import FilterGroup from '@/features/navigation/Filter/FilterGroup';

export default async function WithFilterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const categories = await fetchAllCategories(lang);

  return (
    <>
      <Suspense fallback={<FilterSkeleton />}>
        <FilterGroup
          categories={categories}
          dictionary={dictionary}
          lang={lang}
        />
      </Suspense>
      {children}
    </>
  );
}

function FilterSkeleton() {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
      {/* Category dropdown skeleton */}
      <div className="flex flex-col">
        <div className="mb-2 h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full sm:w-48 bg-gray-200 rounded-md animate-pulse" />
      </div>
      
      {/* Sort dropdown skeleton */}
      <div className="flex flex-col">
        <div className="mb-2 h-4 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-full sm:w-48 bg-gray-200 rounded-md animate-pulse" />
      </div>
      
      {/* Reset button skeleton */}
      <div className="flex flex-col justify-end">
        <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-md animate-pulse" />
      </div>
    </div>
  );
}