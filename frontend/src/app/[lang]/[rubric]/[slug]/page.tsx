// src/app/ru/[rubric]/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFullArticle, fetchRubricBasics } from '@/main/lib/directus';
import { ArticleEngagement, Content, Header, ScrollToTopButton, RelatedArticles, TableOfContents, QuickNavigation, CategoriesSection, RubricSection, AuthorsSection } from '@/main/components/Article';
import Section from '@/main/components/Main/Section';
import { dictionary, getDictionary, Lang } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { processContent } from '@/main/lib/markdown/processContent';
import SmartBreadcrumbs, { enhanceArticleForBreadcrumbs } from '@/main/components/Navigation/Breadcrumbs/SmartBreadcrumbs';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import StandardError from '@/main/components/errors/StandardError';
import generateArticleMetadata, { generateArticleNotFoundMetadata } from '@/main/components/SEO/metadata/ArticleMetadata';
import ArticleSchema from '@/main/components/SEO/schemas/ArticleSchema';
import QuickNavigationSchema from '@/main/components/SEO/schemas/QuickNavigationSchema';
import AuthorsSectionSchema from '@/main/components/SEO/schemas/AuthorsSectionSchema';
import { isPreviewMode } from '@/main/lib/utils/previewMode';
import PreviewBanner from '@/main/components/Article/PreviewBanner';

// ISR CONFIGURATION: 1 hour (articles rarely change after publish)
export const revalidate = 3600;
export const dynamicParams = true;

// Helper function to validate preview mode from URL params
function isValidPreview(previewParam: string | undefined, secretParam: string | undefined): boolean {
  const PREVIEW_SECRET = process.env.PREVIEW_SECRET;
  return previewParam === 'true' && secretParam === PREVIEW_SECRET;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, rubric: string, slug: string }> 
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const lang = resolvedParams.lang;
    const dictionary = getDictionary(lang as Lang);

    // Check preview mode at page level
    const inPreview = await isPreviewMode();
    
    // Pass preview state to fetch function
    const [article] = await Promise.all([
      fetchFullArticle(resolvedParams.slug, lang, inPreview),
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
      rubricName: resolvedParams.rubric,
      author: article.authors[0]?.name || 'EventForMe Editorial',
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageId: article.article_heading_img || null,
      tags: article.categories?.map(cat => cat.name) || [resolvedParams.rubric],
    };

    const metadata = generateArticleMetadata({
      dictionary,
      articleData,
    });

    // Add noindex for preview mode
    if (inPreview) {
      return {
        ...metadata,
        robots: {
          index: false,
          follow: false,
          nocache: true,
        },
      };
    }

    return metadata;

  } catch (error) {
    console.error('Error generating article metadata:', error);
    
    try {
      const resolvedParams = await params;
      const dictionary = getDictionary(resolvedParams.lang as Lang);
      return generateArticleNotFoundMetadata(dictionary, resolvedParams.rubric);

    } catch (error) {
      console.error('Error generating article metadata:', error);
      const errorHandler = createErrorHandler(dictionary);
      return errorHandler.generateErrorMetadata('article');
    }
  }
}

/**
 * Article page with preview support
 */
export default async function ArticlePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: Lang, rubric: string, slug: string }>,
  searchParams: Promise<{ preview?: string, secret?: string }>
}) {
  try {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const lang = resolvedParams.lang;

    // Check preview mode from URL parameters
    const inPreview = isValidPreview(
      resolvedSearchParams.preview,
      resolvedSearchParams.secret
    );

    const [article, rubricBasics] = await Promise.all([
      fetchFullArticle(resolvedParams.slug, lang, inPreview),
      fetchRubricBasics(lang),
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
    const formattedDate = publishedDate.toLocaleDateString(dictionary.locale, {
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

    const currentArticleUrl = `${dictionary.seo.site.url}/${lang}/${resolvedParams.rubric}/${resolvedParams.slug}`;

    return (
      <>
        {/* Show preview banner if in preview mode */}
        {inPreview && <PreviewBanner />}
        
        {/* Structured Data */}
        <ArticleSchema
          dictionary={dictionary}
          articleData={articleSchemaData}
          breadcrumbs={[]} 
        />

        {/* Related Links Schema for enhanced SEO */}
        <QuickNavigationSchema currentArticleUrl={currentArticleUrl} />
        <AuthorsSectionSchema 
          authors={authorsWithDetails}
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
            <div className="container mx-auto">
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
                  editorialText={processTemplate(dictionary.content.labels.editorial, {
                    siteName: dictionary.seo.site.name
                  })}
                />

                {/* Add engagement component */}
                  <ArticleEngagement
                    slug={resolvedParams.slug}
                    title={article.translations[0].title}
                    url={currentArticleUrl}
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

                {/* Quick site navigation links */}
                <QuickNavigation />

                {/* Categories taxonomy */}
                {categoriesData.length > 0 && (
                  <CategoriesSection categories={categoriesData} />
                )}

                {/* Rubric classification */}
                <RubricSection rubric={rubricData} />

                {/* Author(s) cards - handles single or multiple authors */}
                <AuthorsSection authors={authorsWithDetails} />

                {/* Related Articles with Tiered Matching */}
                <RelatedArticles
                  currentArticleSlug={resolvedParams.slug}
                  articleCategories={categoriesData}
                  lang={lang}
                  dictionary={dictionary}
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