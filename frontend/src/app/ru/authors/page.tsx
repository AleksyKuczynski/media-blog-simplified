// src/app/ru/authors/page.tsx - FIXED WITH H1
import { Suspense } from 'react';
import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import getDictionary from '@/main/lib/dictionary/getDictionary';

export const dynamic = 'force-dynamic';

export default async function AllAuthorsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const dict = await getDictionary('ru');
  const rubricBasics = await fetchRubricBasics('ru');
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  
  const authors = await fetchAllAuthors('ru');

  const breadcrumbItems = [
    { label: dict.sections.authors.ourAuthors, href: '/ru/authors' },
  ];

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang="ru"
        translations={{
          home: dict.navigation.labels.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
      
      {/* ✅ FIXED: Added proper H1 tag for SEO */}
      <Section>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {dict.sections.authors.ourAuthors}
        </h1>
        
        <Suspense fallback={
          <div className="text-center py-8">
            <div className="text-lg">{dict.common.status.loading}</div>
          </div>
        }>
          {authors.length > 0 ? (
            <CardGrid>
              {authors.map((author) => (
                <AuthorCard 
                  key={author.slug}
                  author={author}
                  lang="ru"
                />
              ))}
            </CardGrid>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              {dict.sections.authors.noAuthorsFound}
            </p>
          )}
        </Suspense>
      </Section>
    </>
  );
}