// src/app/[lang]/(collections)/layout.tsx
import { Suspense } from 'react';
import { Lang, getDictionary } from '@/config/i18n';
import { fetchRubricBasics, fetchAllCategories } from '@/api/directus';
import BreadcrumbsWrapper from '@/features/navigation/Breadcrumbs/BreadcrumbsWrapper';

export default async function CollectionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;
  const dictionary = await getDictionary(lang);
  
  const [rubrics, categories] = await Promise.all([
    fetchRubricBasics(lang),
    fetchAllCategories(lang),
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <BreadcrumbsWrapper
          lang={lang}
          dictionary={dictionary}
          rubrics={rubrics}
          categories={categories}
        />
      </Suspense>
      {children}
    </>
  );
}