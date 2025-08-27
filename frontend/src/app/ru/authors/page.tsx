// src/app/(main)/authors/page.tsx

import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus/index';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { Metadata } from 'next';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { lang } }: { params: { lang: Lang } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: dict.sections.authors.pageTitle,
    description: dict.sections.authors.pageDescription,
  };
}

export default async function AuthorsPage({ params: { lang } }: { params: { lang: Lang } }) {
  const dict = await getDictionary(lang);
  const authors = await fetchAllAuthors(lang);
  const rubricNames = await fetchRubricBasics(lang);

  const breadcrumbItems = [
    { label: dict.sections.authors.ourAuthors, href: `/${lang}/authors` },
  ];

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricNames} 
        lang={lang}
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
              <AuthorCard key={author.slug} author={author} lang={lang} />
            ))
          )}
        </CardGrid>
      </Section>
    </>
  );
}