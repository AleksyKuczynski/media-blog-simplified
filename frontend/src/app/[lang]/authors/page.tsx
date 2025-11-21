// src/app/[lang]/authors/page.tsx
import { Suspense } from 'react';
import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import { AuthorCardSkeleton } from '@/main/components/Main/AuthorCardSkeleton';
import { getDictionary, Lang } from '@/main/lib/dictionary';

// ISR CONFIGURATION: 1 hour (authors list is structural)
export const revalidate = 3600;

export default async function AllAuthorsPage({
  params,
}: {
   params:  Promise<{ lang: Lang }> 
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  const rubricBasics = await fetchRubricBasics(lang);
  
  const authors = await fetchAllAuthors(lang);

  const breadcrumbItems = [
    { label: dictionary.sections.authors.ourAuthors, href: `/${lang}/authors` },
  ];

  return (
    <>
      <Suspense fallback={
        <div className="h-8 bg-gray-100 rounded animate-pulse mb-4" />
      }>
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang={lang}
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
                  lang={lang}
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