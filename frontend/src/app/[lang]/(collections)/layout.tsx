// src/app/[lang]/(collections)/layout.tsx
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Lang, getDictionary } from '@/config/i18n';
import { fetchRubricBasics, fetchAllCategories, fetchAuthorBySlug } from '@/api/directus';
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

  // Try to detect if we're on an author page and fetch author name
  let authorName: string | undefined;
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || headersList.get('referer');
    
    if (pathname) {
      const authorMatch = pathname.match(new RegExp(`\\/${lang}\\/authors\\/([^\\/]+)`));
      if (authorMatch) {
        const authorSlug = authorMatch[1].split('?')[0]; // Remove query params
        const author = await fetchAuthorBySlug(authorSlug, lang);
        authorName = author?.name;
      }
    }
  } catch (error) {
    // Silently fail - authorName will remain undefined
  }

  return (
    <>
      <Suspense fallback={null}>
        <BreadcrumbsWrapper
          lang={lang}
          dictionary={dictionary}
          rubrics={rubrics}
          categories={categories}
          authorName={authorName}
        />
      </Suspense>
      {children}
    </>
  );
}