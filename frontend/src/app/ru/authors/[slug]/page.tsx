// src/app/ru/authors/[slug]/page.tsx
// FIXED: Updated to use new dictionary and SEO architecture

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchRubricBasics, DIRECTUS_URL, fetchArticleSlugs, ArticleSlugInfo } from '@/main/lib/directus/index';
import getDictionary from '@/main/lib/dictionary/getDictionary'; // FIXED: Use new dictionary import
import ArticleList from '@/main/components/Main/ArticleList';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';

// FIXED: Import new SEO components
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import generateAuthorMetadata from '@/main/components/SEO/metadata/AuthorMetadata';
import AuthorSchema from '@/main/components/SEO/schemas/AuthorSchema';
import Link from 'next/link';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  try {
    const [dictionary, author] = await Promise.all([
      getDictionary('ru'), // FIXED: Use new dictionary
      fetchAuthorBySlug(params.slug, 'ru'),
    ]);
    
    if (!author) {
      return {
        title: 'Автор не найден — EventForMe',
        description: 'Запрашиваемый автор не найден.',
      };
    }

    // Get article count for this author
    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], params.slug);
    const articleCount = slugs.length;

    // FIXED: Use new AuthorMetadata component
    return await generateAuthorMetadata({
      dictionary,
      authorData: {
        name: author.name,
        slug: params.slug,
        bio: author.bio,
        avatar: author.avatar,
        articleCount,
        path: `/ru/authors/${params.slug}`,
        featured: false,
      },
    });
  } catch (error) {
    console.error('Error generating author metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Автор — EventForMe',
      description: 'Узнайте больше об авторе на EventForMe.',
    };
  }
}

export default async function AuthorPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }, 
  searchParams: { page?: string, sort?: string }
}) {
  try {
    const [dictionary, author, rubricBasics] = await Promise.all([
      getDictionary('ru'), // FIXED: Use new dictionary
      fetchAuthorBySlug(params.slug, 'ru'),
      fetchRubricBasics('ru'),
    ]);
    
    if (!author) {
      notFound();
    }
    
    const currentPage = Number(searchParams.page) || 1;
    const currentSort = searchParams.sort || 'desc';

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
        params.slug
      );
      allSlugInfos = [...allSlugInfos, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

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
      {
        label: author.name,
        href: `/ru/authors/${params.slug}`,
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
        {/* FIXED: Use new AuthorSchema component */}
        <AuthorSchema
          dictionary={dictionary}
          authorData={{
            name: author.name,
            slug: params.slug,
            bio: author.bio,
            avatar: author.avatar,
            articleCount: allSlugInfos.length,
            articles: articlesForSchema,
          }}
          currentPath={`/ru/authors/${params.slug}`}
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
                  {/* FIXED: ArticleList using correct props */}
                  <ArticleList 
                    slugInfos={allSlugInfos}
                    lang="ru"
                    dictionary={dictionary}
                    authorSlug={params.slug}
                    showCount={false}
                  />
                  
                  {/* FIXED: LoadMoreButton using correct props */}
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
                    href="/ru/authors"
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
    
    // Error fallback
    return (
      <Section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Ошибка загрузки автора
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла ошибка при загрузке страницы автора. Попробуйте обновить страницу.
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