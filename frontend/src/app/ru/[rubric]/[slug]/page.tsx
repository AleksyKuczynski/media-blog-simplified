// src/app/ru/[rubric]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFullArticle, fetchRubricBasics } from '@/main/lib/directus';
import { Header, Content, ScrollToTopButton, TableOfContents, RelatedLinksSchema, RelatedLinks } from '@/main/components/Article';
import Section from '@/main/components/Main/Section';
import dictionary from '@/main/lib/dictionary/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { processContent } from '@/main/lib/markdown/processContent';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { generateArticleMetadata, generateArticleNotFoundMetadata } from '@/main/components/SEO/metadata/ArticleMetadata';
import { ArticleSchema } from '@/main/components/SEO/schemas/ArticleSchema';
import SmartBreadcrumbs, { enhanceArticleForBreadcrumbs } from '@/main/components/Navigation/Breadcrumbs/SmartBreadcrumbs';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import StandardError from '@/main/components/errors/StandardError';
import EngagementTest from '@/main/components/Article/EngagementTest';

// ISR CONFIGURATION: 1 hour (articles rarely change after publish)
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ rubric: string, slug: string }> 
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const [article] = await Promise.all([
      fetchFullArticle(resolvedParams.slug, DEFAULT_LANG),
    ]);

    if (!article) {
      return generateArticleNotFoundMetadata(dictionary, resolvedParams.rubric);
    }

    const translation = article.translations[0];
    if (!translation) {
      return generateArticleNotFoundMetadata(dictionary, resolvedParams.rubric);
    }

    const articleData = {
      title: translation.title,
      seoTitle: translation.seo_title,
      description: translation.description,
      seoDescription: translation.seo_description,
      lead: translation.lead,
      slug: resolvedParams.slug,
      rubricSlug: resolvedParams.rubric,
      author: article.authors[0]?.name || 'EventForMe Editorial',
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
        : undefined,
      tags: [resolvedParams.rubric, ...translation.title.split(' ').slice(0, 3)],
    };

    return generateArticleMetadata({
      dictionary,
      articleData,
    });

  } catch (error) {
    console.error('Error generating article metadata:', error);
    
    try {
      const resolvedParams = await params;
      return generateArticleNotFoundMetadata(dictionary, resolvedParams.rubric);

    } catch (error) {
      console.error('Error generating article metadata:', error);
      const errorHandler = createErrorHandler(dictionary);
      return errorHandler.generateErrorMetadata('article');
    }
  }
}

/**
 * Article page with SEO-optimized related links
 */
export default async function ArticlePage({ 
  params,
}: { 
  params: Promise<{ rubric: string, slug: string }>,
  searchParams: Promise<{ author?: string }>
}) {
  try {
        const resolvedParams = await params;

    const [article, rubricBasics] = await Promise.all([
      fetchFullArticle(resolvedParams.slug, 'ru'),
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

    // Transform basic author data to AuthorDetails interface
    // The Header component needs full AuthorDetails for creating author profile links
    const authorsWithDetails = article.authors.map(author => ({
      name: author.name || 'EventForMe Editorial',
      slug: author.slug || '',
      avatar: '', // Default for missing avatar
      bio: '',    // Required by AuthorDetails interface
    }));

    // Build breadcrumbs
    const articleBreadcrumbData = await enhanceArticleForBreadcrumbs(
      article,
      rubricBasics,
      dictionary
    );

    // Schema data
    const articleSchemaData = {
      title: translation.title,
      description: translation.description || undefined,
      lead: translation.lead || undefined,
      slug: resolvedParams.slug,
      rubricSlug: resolvedParams.rubric,
      rubricName: resolvedParams.rubric,
      author: {
        name: article.authors[0]?.name || 'EventForMe Editorial',
        slug: article.authors[0]?.slug || undefined,
      },
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
        : undefined,
      tags: [resolvedParams.rubric, ...translation.title.split(' ').slice(0, 3)],
    };

    // Prepare related links data for SEO enhancement
    const rubricData = {
      slug: resolvedParams.rubric,
      name: resolvedParams.rubric, // Could be enhanced with translated name from rubricBasics
    };

    const categoriesData = article.categories?.map(cat => ({
      slug: cat.slug,
      name: cat.name,
    })) || [];

    const currentArticleUrl = `${dictionary.seo.site.url}/ru/${resolvedParams.rubric}/${resolvedParams.slug}`;

    return (
      <>
        {/* Structured Data */}
        <ArticleSchema
          dictionary={dictionary}
          articleData={articleSchemaData}
          breadcrumbs={[]} 
        />

        {/* Related Links Schema for enhanced SEO */}
        <RelatedLinksSchema
          dictionary={dictionary}
          rubric={rubricData}
          categories={categoriesData}
          currentArticleUrl={currentArticleUrl}
        />

        {/* Breadcrumbs */}
        <SmartBreadcrumbs 
          articleData={articleBreadcrumbData}
          dictionary={dictionary}
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

                {/* ✨ ADD THIS: Test Component */}
                <EngagementTest slug={resolvedParams.slug} />

                {/* Related Links for SEO Enhancement */}
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
    return (
      <StandardError
        dictionary={dictionary}
        contentType="article"
        showRetry={false}
      />
    );
  }
}