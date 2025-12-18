// frontend/src/app/[lang]/[rubric]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFullArticle, fetchRubricBasics, resolveArticleSlug } from '@/api/directus';
import { getDictionary, Lang } from '@/config/i18n';
import { processContent } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/processContent';
import SmartBreadcrumbs, { enhanceArticleForBreadcrumbs } from '@/features/navigation/Breadcrumbs/SmartBreadcrumbs';
import { RelatedArticles } from '@/features/article-display/RelatedArticles';
import generateArticleMetadata from '@/shared/seo/metadata/ArticleMetadata';
import ArticleSchema from '@/shared/seo/schemas/ArticleSchema';
import QuickNavigationSchema from '@/shared/seo/schemas/QuickNavigationSchema';
import AuthorsSectionSchema from '@/shared/seo/schemas/AuthorsSectionSchema';
import Collapsible from '@/shared/ui/Collapsible';
import { Header } from './_components/Header';
import ArticleEngagement from './_components/engagement/ArticleEngagement';
import { TableOfContents } from './_components/navigation/TableOfContents';
import { Content } from './_components/Content';
import QuickNavigation from './_components/navigation/QuickNavigation';
import CategoriesSection from './_components/navigation/CategoriesSection';
import RubricSection from './_components/navigation/RubricSection';
import AuthorsSection from './_components/navigation/AuthorsSection';
import { ScrollToTopButton } from './_components/ScrollToTopButton';
import PreviewBanner from './_components/PreviewBanner';
import StandardError from '@/shared/errors/StandardError';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';

export const revalidate = 3600;
export const dynamicParams = true;

function isValidPreview(previewParam: string | undefined, secretParam: string | undefined): boolean {
  const PREVIEW_SECRET = process.env.PREVIEW_SECRET;
  return previewParam === 'true' && secretParam === PREVIEW_SECRET;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; rubric: string; slug: string }> 
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'article', async (lang, dictionary, resolvedParams) => {
    const { rubric, slug } = resolvedParams;

    // Resolve slug first
    const articleSlug = await resolveArticleSlug(slug, lang);
    if (!articleSlug) {
      // Neither main slug nor local_slug found
      throw new Error('Article not found');
    }
    
    // Check for preview mode - read from headers/cookies
    const inPreview = false; // TODO: Implement proper preview detection
    
    const article = await fetchFullArticle(articleSlug, lang, inPreview);

    if (!article) {
      throw new Error('Article not found');
    }

    const translation = article.translations[0];
    if (!translation) {
      throw new Error('Translation not found');
    }

    const articleData = {
      title: translation.title,
      seoTitle: translation.seo_title,
      description: translation.description,
      seoDescription: translation.seo_description,
      lead: translation.lead,
      slug: slug,
      rubricSlug: rubric,
      rubricName: rubric,
      author: article.authors?.[0]?.name || 'EventForMe Editorial',
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageId: article.article_heading_img || null,
      tags: article.categories?.map(cat => cat.name) || [rubric],
    };

    const metadata = generateArticleMetadata({
      dictionary,
      articleData,
    });

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
  });
}

export default async function ArticlePage({ 
  params,
  searchParams
}: { 
  params: Promise<{ lang: Lang, rubric: string, slug: string }>,
  searchParams: Promise<{ preview?: string, secret?: string }>
}) {
  const { lang, rubric, slug } = await params;
  const dictionary = getDictionary(lang as Lang);

  // Resolve slug first
  const articleSlug = await resolveArticleSlug(slug, lang);
  if (!articleSlug) {
    // Neither main slug nor local_slug found
    throw new Error('Article not found');
  }


  try {
    const { preview, secret } = await searchParams;
    const inPreview = isValidPreview(preview, secret);

    const [article, rubricBasics] = await Promise.all([
      fetchFullArticle(articleSlug, lang, inPreview),
      fetchRubricBasics(lang),
    ]);

    if (!article) {
      notFound();
    }

    const translation = article.translations[0];
    if (!translation) {
      notFound();
    }

    const publishedDate = new Date(article.published_at);
    const formattedDate = publishedDate.toLocaleDateString(dictionary.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const rawContent = translation.article_body
      ?.map((block: any) => block.item?.content || '')
      .join('\n\n') || '';
    
    const processedContent = await processContent(rawContent, lang);
    const { chunks: contentChunks, toc: tocItems } = processedContent;

    const authorsWithDetails = article.authors?.map(author => ({
      name: author.name || 'EventForMe Editorial',
      slug: author.slug || '',
      avatar: author.avatar || '',
      bio: '',
    }));

    // Get rubric name from rubricBasics
    const rubricDetails = rubricBasics.find(r => r.slug === rubric);
    const rubricName = rubricDetails?.name || rubric;

    // FIX: Call enhanceArticleForBreadcrumbs with correct parameters
    const articleBreadcrumbData = enhanceArticleForBreadcrumbs(
      article,
      rubricName,
      rubric
    );

    const currentArticleUrl = `${dictionary.seo.site.url}/${lang}/${rubric}/${slug}`;

    // Schema data
    const articleSchemaData = {
      title: translation.title,
      description: translation.description || translation.lead,
      slug: articleSlug,
      rubricSlug: rubric,
      rubricName: rubricName,
      author: {
        name: article.authors?.[0]?.name || 'EventForMe Editorial',
        slug: article.authors?.[0]?.slug,
      },
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url}/assets/${article.article_heading_img}`
        : undefined,
      tags: article.categories?.map(cat => cat.name) || [],
      wordCount: rawContent.split(/\s+/).length,
    };

    const rubricData = {
      slug: rubric,
      name: rubricName,
    };

    const categoriesData = article.categories?.map(cat => ({
      slug: cat.slug,
      name: cat.name,
    })) || [];

    return (
      <>
        {inPreview && <PreviewBanner />}
        
        <ArticleSchema
          dictionary={dictionary}
          articleData={articleSchemaData}
        />

        <QuickNavigationSchema 
          lang={lang}
          dictionary={dictionary}
          currentArticleUrl={currentArticleUrl}
        />
        
        <AuthorsSectionSchema
          lang={lang}
          dictionary={dictionary}
          authors={authorsWithDetails}
        />

        <SmartBreadcrumbs
          lang={lang}
          articleData={articleBreadcrumbData}
          dictionary={dictionary}
        />

        <article itemScope itemType="https://schema.org/Article" className="container overflow-x-hidden max-w-4xl mx-auto px-2 md:px-4">
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="text-lg">{dictionary.common.status.loading}</div>
            </div>
          }>
            <RubricSection 
              rubric={rubricData}
              lang={lang}
              dictionary={dictionary}
            />
            
            {categoriesData.length > 0 && (
              <CategoriesSection 
                categories={categoriesData}
                lang={lang}
                dictionary={dictionary}
              />
            )}

            <Header
              title={translation.title}
              lead={translation.lead}
              imagePath={article.article_heading_img}
              authors={authorsWithDetails}
              publishedDate={formattedDate}
              lang={lang}
              dictionary={dictionary}
            />

            <ArticleEngagement
              slug={articleSlug}
              title={translation.title}
              url={currentArticleUrl}
            />

            {tocItems.length > 0 && (
              <Collapsible
                title={dictionary.content.labels.tableOfContents}
                ariaLabel={dictionary.content.labels.tableOfContents}
              >
                <TableOfContents items={tocItems} />
              </Collapsible>
            )}

            <Content
              chunks={contentChunks}
              title={translation.title}
              author={article.authors?.[0]?.name || 'EventForMe Editorial'}
              datePublished={article.published_at}
            />

            <QuickNavigation 
              lang={lang}
              dictionary={dictionary}
            />

            {categoriesData.length > 0 && (
              <CategoriesSection 
                categories={categoriesData}
                lang={lang}
                dictionary={dictionary}
              />
            )}

            <RubricSection 
              rubric={rubricData}
              lang={lang}
              dictionary={dictionary}
            />

            {authorsWithDetails.length > 0 && (
              <AuthorsSection 
                authors={authorsWithDetails}
                dictionary={dictionary}
              />
            )}

            <ScrollToTopButton />
          </Suspense>
        </article>

        <RelatedArticles
          currentArticleSlug={articleSlug}
          articleCategories={categoriesData}
          lang={lang}
          dictionary={dictionary}
        />
      </>
    );

  } catch (error) {
    return (
      <StandardError
        dictionary={dictionary}
        contentType="article"
        showRetry={false}
      />
    );
  }
}