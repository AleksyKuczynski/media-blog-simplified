// src/app/[lang]/(collections)/(with-filter)/articles/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import ArticleList from '@/features/article-display/ArticleList';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import CollectionCount from '@/features/layout/CollectionCount';
import { getDictionary, Lang } from '@/config/i18n';
import { generateCollectionMetadata } from '@/shared/seo/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import { fetchArticleSlugs, ITEMS_PER_PAGE } from '@/api/directus';
import { SECTION_COUNT_STYLES } from '@/features/layout/layout.styles';

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    const { slugs } = await fetchArticleSlugs(1, 'desc', lang);
    
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
  searchParams: Promise<{ page?: string; sort?: string; category?: string }>
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const currentSort = resolvedSearchParams.sort || 'desc';
  const categorySlug = resolvedSearchParams.category;

  const { slugs: currentPageSlugs, totalCount } = await fetchArticleSlugs(
    currentPage,
    currentSort,
    lang,
    categorySlug
  );

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
        title={dictionary.sections.articles.allArticles}
        titleLevel="h1"
        ariaLabel={dictionary.sections.articles.allArticles}
        hasNextSectionTitle={true}
        flexGrow={true}
      >
        {totalCount > 0 && (
          <CollectionCount
            count={totalCount}
            countLabel={dictionary.common.count.articles}
            dictionary={dictionary}
            className={SECTION_COUNT_STYLES}
          />
        )}

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-on-sf-var">{dictionary.common.status.loading}</div>
          </div>
        }>
          {currentPageSlugs.length > 0 ? (
            <>
              <ArticleList 
                slugInfos={currentPageSlugs} 
                lang={lang as Lang}
                dictionary={dictionary}
                fromContext="articles"
              />
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  dictionary={dictionary}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12" role="status">
              <p className="text-on-sf-var">
                {dictionary.sections.articles.noArticlesFound}
              </p>
            </div>
          )}
        </Suspense>
      </Section>
    </>
  );
}