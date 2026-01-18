// src/app/[lang]/(collections)/layout.tsx
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
  const dictionary = getDictionary(lang);
  
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const [rubrics, categories] = await Promise.all([
    fetchRubricBasics(lang),
    fetchAllCategories(lang),
  ]);

  // Pre-fetch author name if on author page
  let authorName: string | undefined;
  if (pathname.includes('/authors/')) {
    try {
      const match = pathname.match(/\/authors\/([^/?#]+)/);
      if (match && match[1]) {
        const authorSlug = decodeURIComponent(match[1]);
        const author = await fetchAuthorBySlug(authorSlug, lang);
        if (author) {
          authorName = author.name;
        }
      }
    } catch (error) {
      console.error('Error fetching author for breadcrumbs:', error);
    }
  }

  return (
    <>
      <BreadcrumbsWrapper
        lang={lang}
        dictionary={dictionary}
        rubrics={rubrics}
        categories={categories}
        authorName={authorName}
        key={pathname}
      />
      {children}
    </>
  );
}