// src/app/[lang]/(main)/authors/[slug]/page.tsx

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchRubricBasics, DIRECTUS_URL, fetchArticleSlugs, ArticleSlugInfo } from '@/main/lib/directus/index';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import ArticleList from '@/main/components/Main/ArticleList';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';

export default async function AuthorPage({ params, searchParams }: { 
  params: { slug: string, lang: Lang },
  searchParams: { page?: string, sort?: string }
}) {
  const dict = await getDictionary(params.lang);
  const author = await fetchAuthorBySlug(params.slug, params.lang);
  
  if (!author) {
    notFound();
  }

  const rubricNames = await fetchRubricBasics(params.lang);
  
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
    { label: dict.sections.authors.ourAuthors, href: `/${params.lang}/authors` },
    { label: author.name, href: `/${params.lang}/authors/${params.slug}` },
  ];

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricNames} 
        lang={params.lang}
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
                lang={params.lang}
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
            <p className="text-center text-txcolor-secondary">{dict.sections.author.noArticlesFound}</p>
          )}
        </Suspense>
      </Section>
    </>
  );
}