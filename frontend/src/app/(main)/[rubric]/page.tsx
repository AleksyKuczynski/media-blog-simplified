// src/app/[lang]/(main)/[rubric]/page.tsx

import { notFound } from 'next/navigation';
import ArticleList from '@/main/components/Main/ArticleList';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { fetchArticleSlugs, fetchRubricDetails, fetchRubricBasics, ArticleSlugInfo } from '@/main/lib/directus/index';
import Section from '@/main/components/Main/Section';

export const dynamic = 'force-dynamic';

export default async function RubricPage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string, lang: Lang },
  searchParams: { page?: string }
}) {
  const dict = await getDictionary(params.lang);
  const currentPage = Number(searchParams.page) || 1;
  
  try {
    const rubricDetails = await fetchRubricDetails(params.rubric, params.lang);
    const rubricBasics = await fetchRubricBasics(params.lang);

    if (!rubricDetails) {
      notFound();
    }

    let allSlugs: ArticleSlugInfo[] = [];
    let hasMore = false;

    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        'desc', // You might want to add sorting options to the rubric page in the future
        undefined,
        undefined,
        [],
        undefined,
        params.rubric
      );
      allSlugs = [...allSlugs, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    const rubricName = rubricDetails.translations.find(t => t.languages_code === params.lang)?.name || params.rubric;

    const breadcrumbItems = [
      { label: dict.sections.rubrics.allRubrics, href: `/${params.lang}/rubrics` },
      { label: rubricName, href: `/${params.lang}/${params.rubric}` },
    ];

    return (
      <>
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang={params.lang}
          translations={{
            home: dict.navigation.home,
            allRubrics: dict.sections.rubrics.allRubrics,
            allAuthors: dict.sections.authors.ourAuthors,
          }}
        />
        <h1 className="text-4xl font-bold mb-8">{rubricName}</h1>
        <Section 
          isOdd={true}
          ariaLabel={rubricName}
        >
          <ArticleList 
          slugInfos={allSlugs} 
          lang={params.lang} 
          rubricSlug={params.rubric} 
          />
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <LoadMoreButton
                currentPage={currentPage}
                loadMoreText={dict.common.loadMore}
              />
            </div>
          )}
        </Section>
      </>
    );
  } catch (error) {
    console.error('Error in RubricPage:', error);
    notFound();
  }
}