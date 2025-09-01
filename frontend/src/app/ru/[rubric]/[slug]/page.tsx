
// src/app/ru/[rubric]/[slug]/page.tsx - Add SEO Components
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getArticlePageData } from '@/main/lib/actions';
import { Header, Content, ScrollToTopButton, TableOfContents } from '@/main/components/Article';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { SeoBreadcrumbs } from '@/main/components/Main/SeoBreadcrumbs';

// ✅ NEW: Import your SEO components
import { generateSEOMetadata } from '@/main/components/SEO/SEOManager';
import { StructuredDataManager } from '@/main/components/SEO/StructuredDataManager';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';

// ✅ NEW: Add the missing generateMetadata function
export async function generateMetadata({ 
  params 
}: { 
  params: { rubric: string, slug: string } 
}): Promise<Metadata> {
  const dict = await getDictionary('ru');
  const data = await getArticlePageData(
    { ...params, lang: 'ru' },
    {}
  );

  if (!data) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }

  const { article, translation } = data;

  // ✅ USE your SEOManager component!
  return generateSEOMetadata({
    dict,
    pageType: 'article',
    pageData: {
      title: translation.title,
      description: translation.lead || translation.description,
      path: `/${params.rubric}/${params.slug}`,
      imageUrl: article.article_heading_img ? 
        `https://event4me.eu/assets/${article.article_heading_img}` : 
        undefined,
      articleData: {
        publishedTime: article.published_at,
        modifiedTime: article.updated_at,
        author: article.authors?.[0]?.name || 'EventForMe Editorial',
        section: params.rubric,
        tags: [params.rubric] // You can enhance this with actual tags
      }
    }
  });
}

export default async function ArticlePage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string, slug: string },
  searchParams: { author?: string }
}) {
  const dict = await getDictionary('ru');
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
    processedContent
  } = data;

  // ✅ NEW: Prepare data for StructuredDataManager
  const structuredData = {
    title: translation.title,
    description: translation.lead || translation.description,
    author: article.authors?.[0]?.name || 'EventForMe Editorial',
    publishedTime: article.published_at,
    modifiedTime: article.updated_at,
    imageUrl: article.article_heading_img ? 
      `https://event4me.eu/assets/${article.article_heading_img}` : 
      'https://event4me.eu/og-article.jpg',
    url: `https://event4me.eu/ru/${params.rubric}/${params.slug}`
  };

  return (
    <>
      {/* ✅ NEW: Add StructuredDataManager component */}
      <StructuredDataManager 
        dict={dict}
        pageType="article"
        data={structuredData}
      />
      
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
        
        <Header 
          title={translation.title}
          publishedDate={formattedDate}
          authors={article.authors || []}
          lang="ru"
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
          lang="ru"
          translations={{
            home: dict.navigation.home,
            allRubrics: dict.sections.rubrics.allRubrics,
            allAuthors: dict.sections.authors.ourAuthors,
          }}
        />
      </article>
    </>
  );
}