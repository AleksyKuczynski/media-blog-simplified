// src/app/[lang]/(collections)/authors/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchAllAuthors, fetchRubricBasics } from '@/api/directus';
import Section from '@/features/layout/Section';
import { AuthorCardSkeleton } from '@/features/author-display/AuthorCardSkeleton';
import { AuthorsList } from '@/features/author-display/AuthorsList';
import { AUTHORS_GRID_STYLES } from '@/features/author-display/author.styles';
import { getDictionary, Lang } from '@/config/i18n';
import { generateCollectionMetadata } from '@/shared/seo/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import CollectionDescription from '@/features/layout/CollectionDescription';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';

// ISR CONFIGURATION: 1 hour (authors list is structural)
export const revalidate = 3600;

export default async function AllAuthorsPage({
  params,
}: {
   params:  Promise<{ lang: Lang }> 
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
  // Fetch both for schema generation
  const [authors, illustrators] = await Promise.all([
    fetchAllAuthors(lang, 'author'),
    fetchAllAuthors(lang, 'illustrator'),
  ]);

  // Prepare schema items for authors
  const authorSchemaItems = authors.map(author => ({
    name: author.name,
    slug: author.slug,
    url: `/${lang}/authors/${author.slug}`,
    description: author.bio || `${author.name} - ${dictionary.sections.labels.author}`,
    articleCount: author.articleCount,
  }));

  // Prepare schema items for illustrators
  const illustratorSchemaItems = illustrators.map(illustrator => ({
    name: illustrator.name,
    slug: illustrator.slug,
    url: `/${lang}/authors/${illustrator.slug}`,
    description: illustrator.bio || `${illustrator.name} - ${dictionary.sections.illustrators.ourIllustrators}`,
    articleCount: illustrator.articleCount,
  }));

  return (
    <>
      {/* Authors Collection Schema */}
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="authors"
        items={authorSchemaItems}
        totalCount={authors.length}
        currentPath={`/${lang}/authors`}
        featured={false}
      />

      {/* Illustrators Collection Schema - separate schema */}
      {illustrators.length > 0 && (
        <CollectionPageSchema
          dictionary={dictionary}
          collectionType="illustrators"
          items={illustratorSchemaItems}
          totalCount={illustrators.length}
          currentPath={`/${lang}/authors#illustrators`}
          featured={false}
        />
      )}
      
      {/* Authors Section */}
      <Section
        title={dictionary.sections.authors.ourAuthors}
        titleLevel="h1"
        hasNextSectionTitle={true}
        id="authors"
      >
        <CollectionDescription>
          {dictionary.sections.authors.collectionPageDescription}
        </CollectionDescription>

        <Suspense fallback={
          <div className={AUTHORS_GRID_STYLES}>
            {Array.from({ length: 6 }, (_, i) => (
              <AuthorCardSkeleton key={i} />
            ))}
          </div>
        }>
          <AuthorsList 
            lang={lang} 
            roleFilter="author"
            emptyMessage={dictionary.sections.authors.noAuthorsFound}
          />
        </Suspense>
      </Section>

      {/* Illustrators Section */}
      <Section
        title={dictionary.sections.illustrators.ourIllustrators}
        titleLevel="h2"
        variant="secondary"
        hasNextSectionTitle={true}
        id="illustrators"
      >
        <Suspense fallback={
          <div className={AUTHORS_GRID_STYLES}>
            {Array.from({ length: 6 }, (_, i) => (
              <AuthorCardSkeleton key={i} />
            ))}
          </div>
        }>
          <AuthorsList 
            lang={lang} 
            roleFilter="illustrator"
            emptyMessage={dictionary.sections.illustrators.noIllustratorsFound}
          />
        </Suspense>
      </Section>

      <RandomArticlesSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.sections.rubrics.readMoreAbout}
        variant="tertiary"
        limit={6}
      />


    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    const [authors, illustrators] = await Promise.all([
      fetchAllAuthors(lang, 'author'),
      fetchAllAuthors(lang, 'illustrator'),
    ]);
    
    // Combine both collections for metadata
    const totalCount = authors.length + illustrators.length;
    
    // Use first 5 authors for metadata items
    const authorItems = authors.slice(0, 5).map(author => ({
      name: author.name,
      slug: author.slug,
      description: author.bio || `${author.name} - ${dictionary.sections.labels.author}`,
      articleCount: author.articleCount,
    }));

    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'authors',
      items: authorItems,
      totalCount,
      currentPath: `/${lang}/authors`,
      featured: false,
    });
  });
}