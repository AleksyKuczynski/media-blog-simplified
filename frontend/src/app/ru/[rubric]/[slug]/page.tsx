// src/app/ru/[rubric]/[slug]/page.tsx - FIX METADATA ERROR
import { notFound } from 'next/navigation';
import { getArticlePageData } from '@/main/lib/actions';
import { Header, Content, ScrollToTopButton, TableOfContents } from '@/main/components/Article';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { SeoBreadcrumbs } from '@/main/components/Main/SeoBreadcrumbs';

export default async function ArticlePage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string, slug: string },
  searchParams: { author?: string }
}) {
  const data = await getArticlePageData(
    { ...params, lang: 'ru' },
    searchParams
  );

  if (!data) {
    notFound();
  }

  const { 
    article, 
    translation, 
    breadcrumbItems, 
    rubricBasics, 
    formattedDate, 
    processedContent, 
    dict, 
  } = data;

  return (
    <article className="container mx-auto max-w-[1200px] px-4">
      <ScrollToTopButton />
      
      <SeoBreadcrumbs 
        articleSlug={params.slug}
        rubricSlug={params.rubric}
        title={translation.title}
      />
      
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang="ru"
        translations={{
          home: dict.navigation.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
      
      {/* ✅ FIXED: Header component handles all metadata display including authors */}
      <Header 
        title={translation.title}
        publishedDate={formattedDate}
        authors={article.authors || []} // ✅ FIX: Ensure authors is never undefined
        lang="ru"
        editorialText={dict.common.editorial}
        imagePath={article.article_heading_img}
        lead={translation.lead}
      />

      {/* ✅ REMOVED: Separate Metadata component call - Header handles this now */}

      {processedContent.toc.length > 1 && (
        <TableOfContents items={processedContent.toc} title={dict.common.tableOfContents} />
      )}

      <Content chunks={processedContent.chunks} toc={processedContent.toc} />
      
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang="ru"
        translations={{
          home: dict.navigation.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
    </article>
  );
}