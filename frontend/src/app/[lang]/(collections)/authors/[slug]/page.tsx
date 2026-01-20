// src/app/[lang]/(collections)/authors/[slug]/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import { fetchAuthorBySlug, DIRECTUS_URL, fetchArticleSlugs, ITEMS_PER_PAGE } from '@/api/directus/index';
import ArticleList from '@/features/article-display/ArticleList';
import { ArticleListSkeleton } from '@/features/article-display/ArticleListSkeleton';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import StandardError from '@/shared/errors/StandardError';
import { processTemplate } from '@/config/i18n/helpers/templates';
import generateAuthorMetadata from '@/shared/seo/metadata/AuthorMetadata';
import AuthorSchema from '@/shared/seo/schemas/AuthorSchema';
import { getDictionary, Lang } from '@/config/i18n';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import CollectionCount from '@/features/layout/CollectionCount';
import { SECTION_COUNT_STYLES } from '@/features/layout/styles';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, slug: string }> 
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'author', async (lang, dictionary, resolvedParams) => {
    const { slug } = resolvedParams;
    
    const author = await fetchAuthorBySlug(slug, lang);
    
    if (!author) {
      throw new Error('Author not found');
    }

    // Count both authored and illustrated articles
    const [authoredResult, illustratedResult] = await Promise.all([
      fetchArticleSlugs(1, 'desc', lang, undefined, undefined, [], slug, undefined, undefined),
      fetchArticleSlugs(1, 'desc', lang, undefined, undefined, [], undefined, slug, undefined),
    ]);

    const totalCount = authoredResult.totalCount + illustratedResult.totalCount;

    return generateAuthorMetadata({
      dictionary,
      authorData: {
        name: author.name,
        slug: slug,
        bio: author.bio,
        avatar: author.avatar,
        articleCount: totalCount,
        path: `/${lang}/authors/${slug}`,
        featured: false,
      },
    });
  });
}

export default async function AuthorPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: Lang, slug: string }>, 
  searchParams: Promise<{ page?: string, sort?: string }> 
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const dictionary = await getDictionary(lang);

  const author = await fetchAuthorBySlug(slug, lang);
  
  if (!author) {
    return <StandardError dictionary={dictionary} contentType="author" />;
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const sort = resolvedSearchParams.sort || 'desc';

  // Fetch both authored and illustrated articles
  const [authoredResult, illustratedResult] = await Promise.all([
    fetchArticleSlugs(page, sort, lang, undefined, undefined, [], slug, undefined, undefined),
    fetchArticleSlugs(page, sort, lang, undefined, undefined, [], undefined, slug, undefined),
  ]);

  const { slugs: authoredSlugs, totalCount: authoredCount } = authoredResult;
  const { slugs: illustratedSlugs, totalCount: illustratedCount } = illustratedResult;

  console.log('[AuthorPage] Author slug:', slug);
  console.log('[AuthorPage] Authored articles count:', authoredCount);
  console.log('[AuthorPage] Illustrated articles count:', illustratedCount);
  console.log('[AuthorPage] Authored slugs:', authoredSlugs.map(s => s.slug));
  console.log('[AuthorPage] Illustrated slugs:', illustratedSlugs.map(s => s.slug));

  const totalPages = Math.ceil(authoredCount / ITEMS_PER_PAGE);
  const illustratedTotalPages = Math.ceil(illustratedCount / ITEMS_PER_PAGE);
  const currentPath = `/${lang}/authors/${slug}`;

  return (
    <>
      <AuthorSchema
        dictionary={dictionary}
        authorData={{
          name: author.name,
          slug: slug,
          bio: author.bio,
          avatar: author.avatar,
          articleCount: authoredCount + illustratedCount,
        }}
        currentPath={currentPath}
      />

      {/* Author Header */}
      <section className="bg-sf-cont py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {author.avatar ? (
              <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={`${DIRECTUS_URL}/assets/${author.avatar}`}
                  alt={processTemplate(dictionary.sections.authors.authorPhoto, {
                    name: author.name
                  })}
                  fill
                  className="object-cover"
                  sizes="192px"
                  priority
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center flex-shrink-0">
                <span className="text-on-pr-cont text-6xl font-bold">
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h1 
                className="text-4xl font-bold mb-4 text-on-sf"
                itemProp="name"
              >
                {author.name}
              </h1>
              
              {author.bio && (
                <p 
                  className="text-lg text-on-sf-var mb-4 max-w-3xl"
                  itemProp="description"
                >
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles by Author Section */}
      {authoredCount > 0 && (
        <Section 
          title={processTemplate(dictionary.sections.authors.articlesWrittenBy, {
            author: author.name
          })}
          hasNextSectionTitle={illustratedCount > 0}
        >
          <CollectionCount 
            count={authoredCount}
            countLabel={dictionary.common.count.articles}
            dictionary={dictionary}
            className={SECTION_COUNT_STYLES}
          />
          
          <div className="container mx-auto px-4">
            <Suspense fallback={<ArticleListSkeleton count={6} ariaLabel={dictionary.common.status.loading} />}>
              <ArticleList 
                slugInfos={authoredSlugs} 
                lang={lang}
                dictionary={dictionary}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  dictionary={dictionary}
                />
              )}
            </Suspense>
          </div>
        </Section>
      )}

      {/* Articles Illustrated by Author Section */}
      {illustratedCount > 0 && (
        <Section 
          title={`${dictionary.sections.labels.illustratedBy} ${author.name}`}
          hasNextSectionTitle={false}
        >
          <CollectionCount 
            count={illustratedCount}
            countLabel={dictionary.common.count.articles}
            dictionary={dictionary}
            className={SECTION_COUNT_STYLES}
          />
          
          <div className="container mx-auto px-4">
            <Suspense fallback={<ArticleListSkeleton count={6} ariaLabel={dictionary.common.status.loading} />}>
              <ArticleList 
                slugInfos={illustratedSlugs} 
                lang={lang}
                dictionary={dictionary}
              />
              {illustratedTotalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={illustratedTotalPages}
                  dictionary={dictionary}
                />
              )}
            </Suspense>
          </div>
        </Section>
      )}
    </>
  );
}