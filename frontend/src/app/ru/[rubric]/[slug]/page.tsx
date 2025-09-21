// src/app/ru/[rubric]/[slug]/page.tsx
// ENHANCED: Added SEO-optimized related links for better internal linking

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFullArticle, fetchRubricBasics } from '@/main/lib/directus';
import { Header, Content, ScrollToTopButton, TableOfContents } from '@/main/components/Article';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import getDictionary from '@/main/lib/dictionary/getDictionary';
import { processContent } from '@/main/lib/markdown/processContent';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import ErrorFallback from '@/main/components/Common/ErrorFallback';

// SEO Components
import { generateArticleMetadata, generateArticleNotFoundMetadata } from '@/main/components/SEO/metadata/ArticleMetadata';
import { ArticleSchema } from '@/main/components/SEO/schemas/ArticleSchema';

// NEW: Related Links for SEO enhancement
import RelatedLinks, { RelatedLinksSchema } from '@/main/components/Article/RelatedLinks';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ 
  params 
}: { 
  params: { rubric: string, slug: string } 
}): Promise<Metadata> {
  try {
    const [dictionary, article] = await Promise.all([
      getDictionary('ru'),
      fetchFullArticle(params.slug, 'ru'),
    ]);

    if (!article) {
      return generateArticleNotFoundMetadata(dictionary, params.rubric);
    }

    const translation = article.translations[0];
    if (!translation) {
      return generateArticleNotFoundMetadata(dictionary, params.rubric);
    }

    const articleData = {
      title: translation.title,
      seoTitle: translation.seo_title,
      description: translation.description,
      seoDescription: translation.seo_description,
      lead: translation.lead,
      slug: params.slug,
      rubricSlug: params.rubric,
      author: article.authors[0]?.name || 'EventForMe Editorial',
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
        : undefined,
      tags: [params.rubric, ...translation.title.split(' ').slice(0, 3)],
    };

    return await generateArticleMetadata({
      dictionary,
      articleData,
    });

  } catch (error) {
    console.error('Error generating article metadata:', error);
    
    try {
      const dictionary = await getDictionary('ru');
      return generateArticleNotFoundMetadata(dictionary, params.rubric);
    } catch (dictError) {
      return {
        title: 'Ошибка — EventForMe',
        description: 'Произошла ошибка при загрузке страницы.',
      };
    }
  }
}

/**
 * ENHANCED: Article page with SEO-optimized related links
 */
export default async function ArticlePage({ 
  params,
}: { 
  params: { rubric: string, slug: string },
  searchParams: { author?: string }
}) {
  let dictionary;
  
  try {
    dictionary = await getDictionary('ru');
  } catch (dictionaryError) {
    console.error('Critical error: Failed to load dictionary:', dictionaryError);
    return <ErrorFallback dictionary={{} as any} contentType="article" />;
  }

  try {
    const [article, rubricBasics] = await Promise.all([
      fetchFullArticle(params.slug, 'ru'),
      fetchRubricBasics('ru'),
    ]);

    if (!article) {
      notFound();
    }

    const translation = article.translations[0];
    if (!translation) {
      notFound();
    }

    // Format publication date
    const publishedDate = new Date(article.published_at);
    const formattedDate = publishedDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Process content
    const rawContent = translation.article_body
      ? translation.article_body.map(block => block.item.content).join('\n\n')
      : '';

    const processedContent = await processContent(rawContent);
    const { chunks: contentChunks, toc: tocItems } = processedContent;

    // EXPLANATION: Transform basic author data to AuthorDetails interface
    // The Header component needs full AuthorDetails for creating author profile links
    const authorsWithDetails = article.authors.map(author => ({
      name: author.name || 'EventForMe Editorial',
      slug: author.slug || '',
      avatar: '', // Default for missing avatar
      bio: '',    // Required by AuthorDetails interface
    }));

    // Build breadcrumbs
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        label: params.rubric,
        href: `/ru/${params.rubric}`,
      },
      {
        label: translation.title,
        href: `/ru/${params.rubric}/${params.slug}`,
      },
    ];

    // Schema data
    const articleSchemaData = {
      title: translation.title,
      description: translation.description || undefined,
      lead: translation.lead || undefined,
      slug: params.slug,
      rubricSlug: params.rubric,
      rubricName: params.rubric,
      author: {
        name: article.authors[0]?.name || 'EventForMe Editorial',
        slug: article.authors[0]?.slug || undefined,
      },
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
        : undefined,
      tags: [params.rubric, ...translation.title.split(' ').slice(0, 3)],
    };

    const breadcrumbSchemaData = breadcrumbItems.map(item => ({
      name: item.label,
      href: item.href || undefined,
    }));

    // NEW: Prepare related links data for SEO enhancement
    const rubricData = {
      slug: params.rubric,
      name: params.rubric, // Could be enhanced with translated name from rubricBasics
      // FIXED: Removed articleCount since RubricBasic doesn't have this property
    };

    const categoriesData = article.categories?.map(cat => ({
      slug: cat.slug,
      name: cat.name,
    })) || [];

    const currentArticleUrl = `${dictionary.seo.site.url}/ru/${params.rubric}/${params.slug}`;

    return (
      <>
        {/* Structured Data */}
        <ArticleSchema
          dictionary={dictionary}
          articleData={articleSchemaData}
          breadcrumbs={breadcrumbSchemaData}
        />

        {/* NEW: Related Links Schema for enhanced SEO */}
        <RelatedLinksSchema
          dictionary={dictionary}
          rubric={rubricData}
          categories={categoriesData}
          currentArticleUrl={currentArticleUrl}
        />

        {/* Breadcrumbs */}
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

        {/* Article Content */}
        <article itemScope itemType="https://schema.org/Article">
          <Section className="py-8">
            <div className="container mx-auto px-4">
              <Suspense fallback={
                <div className="text-center py-8">
                  <div className="text-lg">{dictionary.common.status.loading}</div>
                </div>
              }>
                {/* Article Header with Author Links */}
                <Header
                  title={translation.title}
                  lead={translation.lead}
                  imagePath={article.article_heading_img}
                  authors={authorsWithDetails} // Creates clickable author profile links
                  publishedDate={formattedDate}
                  lang="ru"
                  editorialText={processTemplate(dictionary.content.labels.editorial, {
                    siteName: dictionary.seo.site.name
                  })}
                />

                {/* Table of Contents */}
                {tocItems.length > 0 && (
                  <TableOfContents
                    items={tocItems}
                    title={dictionary.content.labels.tableOfContents}
                  />
                )}

                {/* Article Body */}
                <Content
                  chunks={contentChunks}
                  toc={tocItems}
                  title={translation.title}
                  author={article.authors[0]?.name || 'EventForMe Editorial'}
                  datePublished={article.published_at}
                />

                {/* NEW: Related Links for SEO Enhancement */}
                <RelatedLinks
                  dictionary={dictionary}
                  rubric={rubricData}
                  categories={categoriesData}
                  className="mt-12 pt-8 border-t border-gray-200"
                />

                {/* Scroll to Top Button */}
                <ScrollToTopButton />
              </Suspense>
            </div>
          </Section>
        </article>
      </>
    );

  } catch (error) {
    console.error('Error in ArticlePage:', error);
    return <ErrorFallback dictionary={dictionary} contentType="article" />;
  }
}