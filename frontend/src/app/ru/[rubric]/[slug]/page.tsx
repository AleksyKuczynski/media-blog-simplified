// src/app/[lang]/(main)/[rubric]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { getArticlePageData } from '@/main/lib/actions';
import { Header, Metadata, Content, ScrollToTopButton, TableOfContents } from '@/main/components/Article';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { SeoBreadcrumbs } from '@/main/components/Main/SeoBreadcrumbs';
import { twMerge } from 'tailwind-merge';

export default async function ArticlePage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string, slug: string, lang: Lang },
  searchParams: { author?: string }
}) {
  const data = await getArticlePageData(params, searchParams);

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
    <article className={twMerge(
      // Base styles
      'container mx-auto max-w-[1200px]',
      // Theme variants
      'theme-default:px-3',
      'theme-rounded:px-4',
      'theme-sharp:px-2'
    )}>
      <ScrollToTopButton />
      <SeoBreadcrumbs 
        articleSlug={params.slug}
        rubricSlug={params.rubric}
        title={translation.title}
        lang={params.lang}
      />
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
      <Metadata 
        categories={article.categories}
        lang={params.lang}
      />
      <Header 
        title={translation.title}
        publishedDate={formattedDate}
        authors={article.authors}
        lang={params.lang}
        editorialText={dict.common.editorial}
        imagePath={article.article_heading_img}
        lead={translation.lead}
      />

      {processedContent.toc.length > 1 && (
        <TableOfContents items={processedContent.toc} title={dict.common.tableOfContents} />
      )}

      <Content chunks={processedContent.chunks} toc={processedContent.toc} />
      
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
    </article>
  );
}