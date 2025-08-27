// src/app/ru/authors/page.tsx

import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus/index';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  // ✅ REMOVED: params parameter - use hardcoded Russian
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  return {
    title: dict.sections.authors.ourAuthors,
    description: dict.sections.authors.ourAuthors,
  };
}

export default async function AuthorsPage() {
  // ✅ REMOVED: params parameter - use hardcoded Russian
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  const authors = await fetchAllAuthors('ru'); // ✅ HARDCODED: Russian language
  const rubricNames = await fetchRubricBasics('ru'); // ✅ HARDCODED: Russian language

  const breadcrumbItems = [
    { label: dict.sections.authors.ourAuthors, href: '/ru/authors' }, // ✅ HARDCODED: Static Russian URL
  ];

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricNames} 
        lang="ru" // ✅ HARDCODED: Russian language
        translations={{
          home: dict.navigation.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
      <Section 
        title={dict.sections.authors.ourAuthors}
        ariaLabel={dict.sections.authors.ourAuthors}
      >
        <CardGrid>
          {authors.length === 0 ? (
            <p className="text-center text-txcolor-secondary">{dict.sections.authors.noAuthorsFound}</p>
          ) : (
            authors.map((author) => (
              <AuthorCard key={author.slug} author={author} lang="ru" />
            ))
          )}
        </CardGrid>
      </Section>
    </>
  );
}