// src/app/ru/authors/page.tsx - FIXED WITH H1
import { Suspense } from 'react';
import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import dictionary from '@/main/lib/dictionary/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants';
import { AuthorCardSkeleton } from '@/main/components/Main/AuthorCardSkeleton';

// ISR CONFIGURATION: 1 hour (authors list is structural)
export const revalidate = 3600;

export default async function AllAuthorsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const rubricBasics = await fetchRubricBasics('ru');
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  
  const authors = await fetchAllAuthors('ru');

  const breadcrumbItems = [
    { label: dictionary.sections.authors.ourAuthors, href: `/${DEFAULT_LANG}/authors` },
  ];

  return (
    <>
      <Suspense fallback={
        <div className="h-8 bg-gray-100 rounded animate-pulse mb-4" />
      }>
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang={DEFAULT_LANG}
          translations={{
            home: dictionary.navigation.labels.home,
            allRubrics: dictionary.sections.rubrics.allRubrics,
            allAuthors: dictionary.sections.authors.ourAuthors,
          }}
        />
      </Suspense>
      
      {/* ✅ FIXED: Added proper H1 tag for SEO */}
      <Section>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {dictionary.sections.authors.ourAuthors}
        </h1>
        
        <Suspense fallback={
          <Section>
            <div className="mb-8 text-center">
              <div className="h-8 w-64 bg-on-sf/10 rounded mx-auto animate-pulse" />
            </div>
            <CardGrid>
              {Array.from({ length: 6 }, (_, i) => (
                <AuthorCardSkeleton key={i} />
              ))}
            </CardGrid>
          </Section>
        }>
          {authors.length > 0 ? (
            <CardGrid>
              {authors.map((author) => (
                <AuthorCard 
                  key={author.slug}
                  author={author}
                  lang={DEFAULT_LANG}
                />
              ))}
            </CardGrid>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {dictionary.sections.authors.noAuthorsFound}
            </p>
          )}
        </Suspense>
      </Section>
    </>
  );
}