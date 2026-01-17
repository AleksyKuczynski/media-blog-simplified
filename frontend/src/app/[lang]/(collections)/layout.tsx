// src/app/[lang]/(collections)/layout.tsx
import { Suspense } from 'react';
import { Lang, getDictionary } from '@/config/i18n';
import { fetchRubricBasics, fetchAllCategories } from '@/api/directus';
import UnifiedBreadcrumbs from '@/features/navigation/Breadcrumbs/UnifiedBreadcrumbs';

export default async function CollectionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string; rubric?: string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang as Lang;
  const dictionary = await getDictionary(lang);
  
  const [rubrics, categories] = await Promise.all([
    fetchRubricBasics(lang),
    fetchAllCategories(lang),
  ]);

  // Build pathname from params
  const pathname = resolvedParams.rubric 
    ? `/${lang}/${resolvedParams.rubric}`
    : `/${lang}`;

  return (
    <>
      <Suspense fallback={null}>
        <UnifiedBreadcrumbs
          lang={lang}
          dictionary={dictionary}
          rubrics={rubrics}
          categories={categories}
          pathname={pathname}
        />
      </Suspense>
      {children}
    </>
  );
}