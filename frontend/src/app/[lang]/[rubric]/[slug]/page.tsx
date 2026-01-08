// frontend/src/app/[lang]/[rubric]/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchAssetMetadata, fetchFullArticle, fetchRubricBasics, resolveArticleSlug } from '@/api/directus';
import { getDictionary, Lang } from '@/config/i18n';
import SmartBreadcrumbs, { enhanceArticleForBreadcrumbs } from '@/features/navigation/Breadcrumbs/SmartBreadcrumbs';
import generateArticleMetadata from '@/shared/seo/metadata/ArticleMetadata';
import ArticleSchema from '@/shared/seo/schemas/ArticleSchema';
import QuickNavigationSchema from '@/shared/seo/schemas/QuickNavigationSchema';
import AuthorsSectionSchema from '@/shared/seo/schemas/AuthorsSectionSchema';
import Collapsible from '@/shared/ui/Collapsible';
import { Header } from './_components/Header';
import ArticleEngagement from './_components/engagement/ArticleEngagement';
import { TableOfContents } from './_components/navigation/TableOfContents';
import QuickNavigation from './_components/navigation/QuickNavigation';
import AuthorsSection from './_components/navigation/AuthorsSection';
import { ScrollToTopButton } from './_components/ScrollToTopButton';
import PreviewBanner from './_components/PreviewBanner';
import StandardError from '@/shared/errors/StandardError';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import CategoriesAndRubricSection from './_components/navigation/CategoriesAndRubricSection';
import { processContent } from './_components/markdown/processContent';
import ArticleContentRenderer from './_components/content/ArticleContentRenderer';
import { parseImageMetadata } from '@/lib/utils/bilingualParser';
import Section from '@/features/layout/Section';
import RelatedArticles from '@/features/article-display/RelatedArticles';
import QuickNavigationSection from '@/features/navigation/QuickNavigationSection';

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

    const articleSlug = await resolveArticleSlug(slug, lang);
    if (!articleSlug) {
      throw new Error('Article not found');
    }
    
    const inPreview = false; // TODO: Implement proper preview detection
    
    const article = await fetchFullArticle(articleSlug, lang, inPreview);

    if (!article) {
      throw new Error('Article not found');
    }

    const translation = article.translations[0];
    if (!translation) {
      throw new Error('Translation not found');
    }

    // Fetch image metadata if article has heading image
    let imageMetadata = null;
    if (article.article_heading_img) {
      const imageData = await fetchAssetMetadata(article.article_heading_img);
      imageMetadata = parseImageMetadata(imageData, lang);
    }

    const articleData = {
      // Basic fields
      title: translation.title,
      description: translation.description,
      lead: translation.lead,
      slug: slug,
      rubricSlug: rubric,
      rubricName: rubric,
      author: article.authorsWithDetails?.[0]?.name || 'EventForMe Editorial',
      illustrator: article.illustratorWithDetails,
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageId: article.article_heading_img || null,
      imageAlt: imageMetadata?.altText,
      tags: article.categories?.map(cat => cat.name) || [rubric],
      
      // SEO fields - ENHANCED
      seoTitle: translation.seo_title,
      seoDescription: translation.seo_description,
      ogTitle: translation.og_title,
      ogDescription: translation.og_description,
      focusKeyword: translation.focus_keyword,
      metaKeywords: translation.meta_keywords,
      yandexDescription: translation.yandex_description,
      
      // Content metrics - ENHANCED
      readingTime: translation.reading_time,
      wordCount: translation.word_count,
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

    // Get rubric name from rubricBasics
    const rubricDetails = rubricBasics.find(r => r.slug === rubric);
    const rubricName = rubricDetails?.name || rubric;

    // Fetch image metadata if article has heading image
    let imageMetadata = null;
    if (article.article_heading_img) {
      const imageData = await fetchAssetMetadata(article.article_heading_img);
      imageMetadata = parseImageMetadata(imageData, lang);
    }

    // Call enhanceArticleForBreadcrumbs with correct parameters
    const articleBreadcrumbData = enhanceArticleForBreadcrumbs(
      article,
      rubricName,
      rubric
    );

    const currentArticleUrl = `${dictionary.seo.site.url}/${lang}/${rubric}/${slug}`;

    // Schema data
    const articleSchemaData = {
      title: translation.og_title || translation.seo_title || translation.title,
      description: translation.og_description || translation.seo_description || translation.description || translation.lead,
      slug: articleSlug,
      rubricSlug: rubric,
      rubricName: rubricName,
      author: {
        name: article.authorsWithDetails[0]?.name || 'EventForMe Editorial',
        slug: article.authorsWithDetails[0]?.slug,
        credentials: article.authorsWithDetails[0]?.credentials,
        telegram_url: article.authorsWithDetails[0]?.telegram_url,
        expertise_areas: article.authorsWithDetails[0]?.expertise_areas,
      },
      illustrator: article.illustratorWithDetails ? {
        name: article.illustratorWithDetails.name,
        slug: article.illustratorWithDetails.slug,
        credentials: article.illustratorWithDetails.credentials,
      } : undefined,
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      imageUrl: article.article_heading_img 
        ? `${dictionary.seo.site.url}/assets/${article.article_heading_img}`
        : undefined,
      imageAlt: imageMetadata?.altText,
      tags: article.categories?.map(cat => cat.name) || [],
      
      // Content metrics - ENHANCED
      wordCount: translation.word_count,
      readingTime: translation.reading_time,
    };

    const rubricData = {
      slug: article.rubric_slug.slug,
      name: rubricName,
      icon: article.rubric_slug.nav_icon,
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
          authors={article.authorsWithDetails}
        />

        <SmartBreadcrumbs
          lang={lang}
          articleData={articleBreadcrumbData}
          dictionary={dictionary}
        />
        
        <article 
          className="container overflow-x-hidden max-w-7xl mx-auto px-2 md:px-4 lg:pb-16"
          itemScope
          itemType="https://schema.org/Article"
        >
          <Suspense fallback={
            <div className="text-center py-8">
              <div className="text-lg">{dictionary.common.status.loading}</div>
            </div>
          }>
            <CategoriesAndRubricSection
              categories={categoriesData}
              rubric={rubricData}
              lang={lang}
              dictionary={dictionary}
            />

            <Header
              title={translation.title}
              lead={translation.lead}
              imagePath={article.article_heading_img}
              authors={article.authorsWithDetails}
              illustrator={article.illustratorWithDetails}
              publishedDate={formattedDate}
              dictionary={dictionary}
            />

            <ArticleEngagement
              slug={articleSlug}
              title={translation.title}
              url={currentArticleUrl}
            />

            {article.toc && tocItems.length > 0 && (
              <Collapsible
                title={dictionary.content.labels.tableOfContents}
                ariaLabel={dictionary.content.labels.tableOfContents}
              >
                <TableOfContents items={tocItems} />
              </Collapsible>
            )}

            <ArticleContentRenderer
              chunks={contentChunks}
              lang={lang}
            />

            <CategoriesAndRubricSection
              categories={categoriesData}
              rubric={rubricData}
              lang={lang}
              dictionary={dictionary}
            />

            {article.authorsWithDetails.length > 0 && (
              <AuthorsSection 
                authors={article.authorsWithDetails}
                dictionary={dictionary}
              />
            )}

            <ScrollToTopButton />
          </Suspense>
        </article>

        <Section
          as="div"
          title={dictionary.sections.rubrics.readMoreAbout}
          titleLevel="h2"
          id="related-articles-section"
          hasNextSectionTitle={true}
        >
          <RelatedArticles
            currentArticleSlug={articleSlug}
            articleCategories={categoriesData}
            lang={lang}
            dictionary={dictionary}
          />
        </Section>

        <Section 
          title={dictionary.sections.home.quickNavigation}
          titleLevel="h2"
          variant='primary'
        >
          <QuickNavigationSection lang={lang} dictionary={dictionary} />
        </Section>        
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