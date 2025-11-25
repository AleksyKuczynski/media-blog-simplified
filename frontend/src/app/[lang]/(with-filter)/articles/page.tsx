// src/app/[lang]/(with-filter)/articles/page.tsx
// FIXED: Uses totalCount from backend, proper totalPages calculation

import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/main/components/Main/ArticleList';
import Pagination from '@/main/components/Main/Pagination';
import Section from '@/main/components/Main/Section';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { fetchArticleSlugs } from '@/main/lib/directus';
import { ITEMS_PER_PAGE } from '@/main/lib/directus/directusConstants';
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { ArticleSlugInfo } from '@/main/lib/directus/directusInterfaces';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    const { slugs } = await fetchArticleSlugs(1, lang, 'desc');
    
    const articleItems = slugs.slice(0, 5).map(slug => ({
      name: slug.slug,
      slug: slug.slug,
      description: processTemplate(dictionary.sections.templates.itemDescription, {
        name: slug.slug,
      }),
    }));

    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'articles',
      items: articleItems,
      totalCount: slugs.length,
      currentPath: `/${lang}/articles`,
      featured: false,
    });
  });
}

export default async function ArticlesPage({ 
  params,
  searchParams 
}: {
  params: Promise<{ lang: Lang }>;
  searchParams: Promise<{ page?: string; sort?: string; category?: string }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';
  const categorySlug = resolvedSearchParams.category;

  // FIXED: Get totalCount from backend
  const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
    currentPage,
    currentSort,
    lang,
    categorySlug
  );

  // FIXED: Calculate totalPages correctly
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="articles"
        items={currentPageSlugs.slice(0, 10).map(slugInfo => ({
          name: slugInfo.slug,
          slug: slugInfo.slug,
          url: `${dictionary.seo.site.url}/${lang}/${slugInfo.slug}`,
          description: processTemplate(dictionary.sections.templates.itemDescription, {
            name: slugInfo.slug,
          }),
        }))}
        totalCount={totalCount}
        currentPath={`/${lang}/articles`}
        featured={false}
      />

      <Section
        ariaLabel={dictionary.sections.articles.allArticles}
        className="py-8"
      >
        <div className="container mx-auto px-4">
          {/* FIXED: Show total count */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-on-sf">
              {dictionary.sections.articles.allArticles}
            </h1>
            {totalCount > 0 && (
              <p className="text-sm text-on-sf-var">
                {processTemplate(dictionary.sections.templates.totalCount, {
                  count: totalCount.toString(),
                  countLabel: dictionary.common.count.articles
                })}
              </p>
            )}
          </header>

          <Suspense fallback={<div>{dictionary.common.status.loading}</div>}>
            {currentPageSlugs.length > 0 ? (
              <>
                <ArticleList 
                  slugInfos={currentPageSlugs} 
                  lang={lang as Lang}
                  dictionary={dictionary}
                  showCount={false}
                />
                
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    dictionary={dictionary}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {dictionary.sections.articles.noArticlesFound}
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </Section>
    </>
  );
}