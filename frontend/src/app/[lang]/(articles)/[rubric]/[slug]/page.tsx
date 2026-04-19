// frontend/src/app/[lang]/(articles)/[rubric]/[slug]/page.tsx
import { notFound, permanentRedirect } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchArticleAltSlug, fetchAssetMetadata, fetchFullArticle, fetchLocalSlug, fetchRubricBasics, resolveArticleSlug } from '@/api/directus';
import { getDictionary, Lang } from '@/config/i18n';
import { enhanceArticleForBreadcrumbs } from '@/features/navigation/Breadcrumbs/SmartBreadcrumbs';
import BreadcrumbsWithContext from './_components/navigation/BreadcrumbsWithContext';
import CategoriesAndRubricSection from './_components/navigation/CategoriesAndRubricSection';
import ArticleEngagement from './_components/engagement/ArticleEngagement';
import generateArticleMetadata from '@/shared/seo/metadata/ArticleMetadata';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import ArticleSchema from '@/shared/seo/schemas/ArticleSchema';
import QuickNavigationSchema from '@/shared/seo/schemas/QuickNavigationSchema';
import AuthorsSectionSchema from '@/shared/seo/schemas/AuthorsSectionSchema';
import AuthorsSection from './_components/navigation/AuthorsSection';
import { Header } from './_components/Header';
import Collapsible from '@/shared/ui/Collapsible';
import { TableOfContents } from './_components/navigation/TableOfContents';
import { ScrollToTopButton } from './_components/ScrollToTopButton';
import StandardError from '@/shared/errors/StandardError';
import { processContent } from './_components/markdown/processContent';
import ArticleContentRenderer from './_components/content/ArticleContentRenderer';
import { ArticleSource } from './_components/ArticleSource';
import { parseImageMetadata } from '@/lib/utils/bilingualParser';
import Section from '@/features/layout/Section';
import RelatedArticles from '@/features/article-display/RelatedArticles';
import { LAYOUT_STYLES, NAVIGATION_STYLES } from './_components/article.styles';
import { ArticlePageSkeleton } from './_components/ArticlePageSkeleton';

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ 
  params,
}: { 
  params: Promise<{ lang: string; rubric: string; slug: string }>;
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'article', async (lang, dictionary, resolvedParams) => {
    const { rubric, slug } = resolvedParams;

    const articleSlug = await resolveArticleSlug(slug, lang);
    if (!articleSlug) {
      throw new Error('Article not found');
    }

    const article = await fetchFullArticle(articleSlug, lang);
    if (!article) {
      throw new Error('Article not found');
    }

    const translation = article.translations[0];
    if (!translation) {
      throw new Error('Translation not found');
    }

    let imageMetadata = null;
    if (article.article_heading_img) {
      const imageData = await fetchAssetMetadata(article.article_heading_img);
      imageMetadata = parseImageMetadata(imageData, lang);
    }

    const articleData = {
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
      seoTitle: translation.seo_title,
      seoDescription: translation.seo_description,
      ogTitle: translation.og_title,
      ogDescription: translation.og_description,
      focusKeyword: translation.focus_keyword,
      metaKeywords: translation.meta_keywords,
      yandexDescription: translation.yandex_description,
      readingTime: translation.reading_time,
      wordCount: translation.word_count,
    };

    const metadata = generateArticleMetadata({ dictionary, lang, articleData });

    const alternateLang = lang === 'en' ? 'ru' : 'en';
    const altSlug = await fetchArticleAltSlug(articleSlug, alternateLang as Lang);
    const localSlugForLang = await fetchLocalSlug(articleSlug, lang as Lang);
    const canonicalSlug = localSlugForLang ?? slug;

    const siteUrl = dictionary.seo.site.url.replace(/\/$/, '');
    const canonicalUrl = `${siteUrl}/${lang}/${rubric}/${canonicalSlug}`;
    const enUrl = lang === 'en' ? canonicalUrl : (altSlug ? `${siteUrl}/en/${rubric}/${altSlug}` : null);
    const ruUrl = lang === 'ru' ? canonicalUrl : (altSlug ? `${siteUrl}/ru/${rubric}/${altSlug}` : null);
    return {
      ...metadata,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          ...(enUrl ? { en: enUrl } : {}),
          ...(ruUrl ? { ru: ruUrl } : {}),
          'x-default': ruUrl ?? canonicalUrl,
        },
      },
    };
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: Lang, rubric: string, slug: string }>,
}) {
  const { lang, rubric, slug } = await params;

  const dictionary = getDictionary(lang as Lang);

  const articleSlug = await resolveArticleSlug(slug, lang);
  if (!articleSlug) {
    notFound();
  }

  // Redirect main slug → language-specific local slug (prevents duplicate content)
  if (slug === articleSlug) {
    const localSlug = await fetchLocalSlug(articleSlug, lang);
    if (localSlug && localSlug !== slug) {
      permanentRedirect(`/${lang}/${rubric}/${localSlug}`);
    }
  }

  const [article, rubricBasics] = await Promise.all([
    fetchFullArticle(articleSlug, lang),
    fetchRubricBasics(lang),
  ]);

  try {
    if (!article) {
      notFound();
    }

    const translation = article.translations[0];
    if (!translation) {
      notFound();
    }

    const publishedDate = article.published_at ? new Date(article.published_at) : null;
    const formattedDate = publishedDate
      ? publishedDate.toLocaleDateString(dictionary.locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

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
        <>
          <ArticleSchema
            dictionary={dictionary}
            lang={lang}
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
        </>

        <article 
          className={LAYOUT_STYLES.articleContainer}
          itemScope
          itemType="https://schema.org/Article"
        >
          <Suspense fallback={<ArticlePageSkeleton dictionary={dictionary} />}>
            <Suspense fallback={null}>
              <BreadcrumbsWithContext
                lang={lang}
                articleData={articleBreadcrumbData}
                dictionary={dictionary}
              />
            </Suspense>
        
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
              imageSource={translation.image_source}
              publishedDate={formattedDate}
              lang={lang}
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

            <ArticleSource
              externalLink={article.external_link}
              lang={lang}
              dictionary={dictionary}
            />

            {article.authorsWithDetails.length > 0 && (
              <AuthorsSection
                className={NAVIGATION_STYLES.relatedLinks.authors.containerBottomMargin} 
                authors={article.authorsWithDetails}
                lang={lang}
                dictionary={dictionary}
              />
            )}

            <CategoriesAndRubricSection
              categories={categoriesData}
              rubric={rubricData}
              lang={lang}
              dictionary={dictionary}
            />

            <ScrollToTopButton />
          </Suspense>
        </article>

        <Section
          as="div"
          title={dictionary.sections.rubrics.readMoreAbout}
          titleLevel="h2"
          id="related-articles-section"
          variant="tertiary"
          hasNextSectionTitle={true}
        >
          <RelatedArticles
            currentArticleSlug={articleSlug}
            articleCategories={categoriesData}
            lang={lang}
            dictionary={dictionary}
          />
        </Section>
      </>
    );

  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_HTTP_ERROR_FALLBACK')) {
      throw error;
    }
    return (
      <StandardError
        dictionary={dictionary}
        contentType="article"
        showRetry={false}
      />
    );
  }
}