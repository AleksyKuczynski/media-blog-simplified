// src/app/ru/authors/[slug]/page.tsx

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchRubricBasics, DIRECTUS_URL, fetchArticleSlugs, ArticleSlugInfo } from '@/main/lib/directus/index';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';
import ArticleList from '@/main/components/Main/ArticleList';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import { generateSEOMetadata } from '@/main/components/SEO/SEOManager';
import { StructuredDataManager } from '@/main/components/SEO/StructuredDataManager';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const dict = await getDictionary('ru');
  const author = await fetchAuthorBySlug(params.slug, 'ru');
  
  if (!author) {
    return {
      title: 'Author Not Found',
      description: 'The requested author could not be found.'
    };
  }

  // ✅ USE your SEOManager component!
  return generateSEOMetadata({
    dict,
    pageType: 'author',
    pageData: {
      title: author.name,
      description: author.bio || `Статьи автора ${author.name} на EventForMe`,
      path: `/authors/${params.slug}`,
      keywords: `${author.name}, ${dict.seo.keywords.authors}`
    }
  });
}

export default async function AuthorPage({ params, searchParams }: { 
  params: { slug: string }, // ✅ REMOVED: lang parameter - no longer expected in static routes
  searchParams: { page?: string, sort?: string }
}) {
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  const author = await fetchAuthorBySlug(params.slug, 'ru'); // ✅ HARDCODED: Russian language
  
  if (!author) {
    notFound();
  }

  const rubricNames = await fetchRubricBasics('ru'); // ✅ HARDCODED: Russian language
  
  const currentPage = Number(searchParams.page) || 1;
  const currentSort = searchParams.sort || 'desc';

  let allSlugs: ArticleSlugInfo[] = [];
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
    allSlugs = [...allSlugs, ...slugs];
    hasMore = pageHasMore;
    if (!pageHasMore) break;
  }

  const breadcrumbItems = [
    { label: dict.sections.authors.ourAuthors, href: '/ru/authors' }, // ✅ HARDCODED: Static Russian URL
    { label: author.name, href: `/ru/authors/${params.slug}` }, // ✅ HARDCODED: Static Russian URL
  ];

  return (
    <>
      <StructuredDataManager 
        dict={dict}
        pageType="author"
        data={{
          name: author.name,
          bio: author.bio,
          avatar: author.avatar ? `https://event4me.eu/assets/${author.avatar}` : null,
          url: `https://event4me.eu/ru/authors/${params.slug}`,
          articleCount: allSlugs.length
        }}
      />
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
      
      <Section className="py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {author.avatar && (
            <Image
              src={`${DIRECTUS_URL}/assets/${author.avatar}`}
              alt={author.name}
              width={200}
              height={200}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold text-primary mb-4">{author.name}</h1>
            {author.bio && <p className="text-txcolor-secondary mb-4">{author.bio}</p>}
          </div>
        </div>
      </Section>

      <Section 
        isOdd={true} 
        title={dict.sections.author.articlesByAuthor.replace('{author}', author.name)}
        className="py-8"
      >
        <Suspense fallback={<div>{dict.common.loading}</div>}>
          {allSlugs.length > 0 ? (
            <>
              <ArticleList 
                slugInfos={allSlugs}
                lang="ru" // ✅ HARDCODED: Russian language
                authorSlug={params.slug}
              />
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <LoadMoreButton
                    currentPage={currentPage}
                    loadMoreText={dict.common.loadMore}
                  />
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-txcolor-secondary">
              {dict.sections.author.noArticlesFound}
            </p>
          )}
        </Suspense>
      </Section>
    </>
  );
}