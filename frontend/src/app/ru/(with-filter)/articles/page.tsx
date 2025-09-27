// src/app/ru/authors/page.tsx
// FIXED: Added SEO metadata generation and structured data

import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchAllAuthors, fetchRubricBasics } from '@/main/lib/directus';
import AuthorCard from '@/main/components/Main/AuthorCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import getDictionary from '@/main/lib/dictionary/getDictionary';

// FIXED: Import SEO components
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { getLocalizedAuthorCount } from '@/main/lib/dictionary/helpers/content';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * FIXED: Generate metadata using new SEO system
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [authors, dictionary] = await Promise.all([
      fetchAllAuthors('ru'),
      getDictionary('ru'),
    ]);
    
    // Transform authors data for metadata generation
    const authorsData = authors.map(author => ({
      name: author.name,
      slug: author.slug,
      description: author.bio,
    }));

    // Generate collection metadata
    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'authors',
      items: authorsData,
      totalCount: authors.length,
      currentPath: '/ru/authors',
      featured: false,
    });
    
  } catch (error) {
    console.error('Error generating authors metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Авторы — EventForMe',
      description: 'Познакомьтесь с нашими авторами и узнайте больше о их работах.',
    };
  }
}

export default async function AllAuthorsPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  try {
    const [dictionary, rubricBasics, authors] = await Promise.all([
      getDictionary('ru'),
      fetchRubricBasics('ru'),
      fetchAllAuthors('ru'),
    ]);

    const currentPage = Number(searchParams.page) || 1;

    // FIXED: Breadcrumb items using correct interface
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        label: dictionary.navigation.labels.authors,
        href: '/ru/authors',
      },
    ];

    // Transform authors for schema
    const authorsForSchema = authors.map(author => ({
      name: author.name,
      slug: author.slug,
      description: author.bio,
      url: `${dictionary.seo.site.url}/ru/authors/${author.slug}`,
    }));

    // Get author count text using helper
    const authorCountText = getLocalizedAuthorCount(dictionary, authors.length);

    return (
      <>
        {/* FIXED: Add structured data schema with correct props */}
        <CollectionPageSchema
          dictionary={dictionary}
          collectionType="authors"
          items={authorsForSchema}
          totalCount={authors.length}
          currentPath="/ru/authors"
          featured={false}
        />
        
        {/* FIXED: Breadcrumbs using correct interface */}
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang="ru"
          translations={{
            home: dictionary.navigation.labels.home,
            allRubrics: dictionary.navigation.labels.rubrics,
            allAuthors: dictionary.navigation.labels.authors,
          }}
        />
        
        {/* Main content section */}
        <Section className="py-8">
          <div className="container mx-auto px-4">
            {/* Page header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {dictionary.navigation.labels.authors}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {dictionary.sections.authors.allAuthors}
              </p>
              <p className="text-sm text-gray-500">
                {authorCountText}
              </p>
            </header>
            
            {/* Authors grid */}
            <Suspense fallback={
              <div className="text-center py-8">
                <div className="text-lg">{dictionary.common.status.loading}</div>
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
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {dictionary.sections.authors.noAuthorsFound}
                  </p>
                  <Link 
                    href="/ru" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {dictionary.navigation.labels.home}
                  </Link>
                </div>
              )}
            </Suspense>
          </div>
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error rendering authors page:', error);
    
    // Error fallback
    return (
      <Section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Ошибка загрузки авторов
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла ошибка при загрузке страницы авторов. Попробуйте обновить страницу.
          </p>
          <Link 
            href="/ru" 
            className="text-blue-600 hover:text-blue-800"
          >
            Вернуться на главную
          </Link>
        </div>
      </Section>
    );
  }
}