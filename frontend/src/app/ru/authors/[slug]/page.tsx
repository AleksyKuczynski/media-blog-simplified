// src/app/ru/authors/[slug]/page.tsx

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchRubricBasics, DIRECTUS_URL, fetchArticleSlugs, ArticleSlugInfo } from '@/main/lib/directus/index';
import dictionary from '@/main/lib/dictionary/dictionary';
import StandardError from '@/main/components/errors/StandardError';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import ArticleList from '@/main/components/Main/ArticleList';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import generateAuthorMetadata from '@/main/components/SEO/metadata/AuthorMetadata';
import AuthorSchema from '@/main/components/SEO/schemas/AuthorSchema';
import Link from 'next/link';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';

// ISR CONFIGURATION: 1 hour (author pages stable)
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const [author] = await Promise.all([
      fetchAuthorBySlug(resolvedParams.slug, DEFAULT_LANG),
    ]);
    
    if (!author) {
      return {
        title: 'Автор не найден — EventForMe',
        description: 'Запрашиваемый автор не найден.',
      };
    }

    // Get article count for this author
    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], resolvedParams.slug);
    const articleCount = slugs.length;

    // Use new AuthorMetadata component
    return await generateAuthorMetadata({
      dictionary,
      authorData: {
        name: author.name,
        slug: resolvedParams.slug,
        bio: author.bio,
        avatar: author.avatar,
        articleCount,
        path: `/${DEFAULT_LANG}/authors/${resolvedParams.slug}`,
        featured: false,
      },
    });
  } catch (error) {
    console.error('Error generating author metadata:', error);
    
    // Use errorHandler instead of hardcoded fallback
    const errorHandler = createErrorHandler(dictionary);
    return errorHandler.generateErrorMetadata('author');
  }
}

export default async function AuthorPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>, 
  searchParams: Promise<{ page?: string, sort?: string }>
}) {
  try {
    const resolvedParams = await params;
    const [author, rubricBasics] = await Promise.all([
      fetchAuthorBySlug(resolvedParams.slug, DEFAULT_LANG),
      fetchRubricBasics(DEFAULT_LANG),
    ]);
    
    if (!author) {
      notFound();
    }
    
    const resolvedSearchParams = await searchParams;
    const currentPage = Number(resolvedSearchParams.page) || 1;
    const currentSort = resolvedSearchParams.sort || 'desc';

    // Fetch articles for all pages up to current page
    let allSlugInfos: ArticleSlugInfo[] = [];
    let hasMore = false;

    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        currentSort,
        undefined,
        undefined,
        [],
        resolvedParams.slug
      );
      allSlugInfos = [...allSlugInfos, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    // Breadcrumb items using correct interface
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: `/${DEFAULT_LANG}`,
      },
      {
        label: dictionary.navigation.labels.authors,
        href: `/${DEFAULT_LANG}/authors`,
      },
      {
        label: author.name,
        href: `/${DEFAULT_LANG}/authors/${resolvedParams.slug}`,
      },
    ];

    // Generate simple articles for schema using only available data
    const articlesForSchema = allSlugInfos.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug, // Use slug as title fallback since title is not available
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/articles/${slugInfo.slug}`, // Generic article URL
      // publishedAt is not available in ArticleSlugInfo, so we omit it
    }));

    // Get article count text using helper
    const articleCountText = getLocalizedArticleCount(dictionary, allSlugInfos.length);

    return (
      <>
        {/* Use new AuthorSchema component */}
        <AuthorSchema
          dictionary={dictionary}
          authorData={{
            name: author.name,
            slug: resolvedParams.slug,
            bio: author.bio,
            avatar: author.avatar,
            articleCount: allSlugInfos.length,
            articles: articlesForSchema,
          }}
          currentPath={`/${DEFAULT_LANG}/authors/${resolvedParams.slug}`}
        />
        
        {/* Breadcrumbs using correct interface */}
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
        
        {/* Author profile section */}
        <Section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {author.avatar && (
                <Image
                  src={`${DIRECTUS_URL}/assets/${author.avatar}`}
                  alt={`Фото автора ${author.name}`}
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-4">{author.name}</h1>
                {author.bio && (
                  <p className="text-lg text-gray-600 mb-4">{author.bio}</p>
                )}
                <p className="text-sm text-gray-500">
                  {articleCountText}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Articles section */}
        <Section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              {dictionary.sections.authors.articlesWrittenBy.replace('{author}', author.name)}
            </h2>
            
            <Suspense fallback={
              <div className="text-center py-8">
                <div className="text-lg">{dictionary.common.status.loading}</div>
              </div>
            }>
              {allSlugInfos.length > 0 ? (
                <>
                  {/* ArticleList using correct props */}
                  <ArticleList 
                    slugInfos={allSlugInfos}
                    lang={DEFAULT_LANG}
                    dictionary={dictionary}
                    authorSlug={resolvedParams.slug}
                    showCount={false}
                  />
                  
                  {/* LoadMoreButton using correct props */}
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <LoadMoreButton
                        currentPage={currentPage}
                        dictionary={dictionary}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {dictionary.common.status.empty}
                  </p>
                  <Link 
                    href={`/${DEFAULT_LANG}/authors`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {dictionary.navigation.labels.authors}
                  </Link>
                </div>
              )}
            </Suspense>
          </div>
        </Section>
      </>
    );
  } catch (error) {
     console.error('Error in AuthorPage:', error);
    
    throw error;
  }
}