// src/app/ru/[rubric]/[slug]/page.tsx
// FIXED: Complete article page with proper imports and compatibility

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchFullArticle, fetchRubricBasics, FullArticle } from '@/main/lib/directus';
import { Header, Content, ScrollToTopButton, TableOfContents } from '@/main/components/Article';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import getDictionary from '@/main/lib/dictionary/getDictionary';
import { getSafeArticleDates } from '@/main/lib/utils/seoDateUtils';
import { 
  buildMetadata, 
  createArticleSEOData,
  validateSEOData 
} from '@/main/components/SEO/core/MetadataBuilder';
import { processContent } from '@/main/lib/markdown/processContent';

export const dynamic = 'force-dynamic';

/**
 * Generate metadata for article pages using established SEO pattern
 */
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
      return {
        title: 'Статья не найдена — EventForMe',
        description: 'Запрашиваемая статья не найдена.',
      };
    }

    const translation = article.translations[0];
    if (!translation) {
      return {
        title: 'Статья не найдена — EventForMe',
        description: 'Запрашиваемая статья не найдена.',
      };
    }

    // Handle dates safely
    const safeDates = getSafeArticleDates(
      article.published_at, 
      article.updated_at
    );

    // Generate image URL
    const imageUrl = article.article_heading_img 
      ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
      : `${dictionary.seo.site.url}/og-default.jpg`;

    // Create canonical URL
    const canonicalUrl = `${dictionary.seo.site.url}/ru/${params.rubric}/${params.slug}`;

    // Create SEO data using established pattern - FIXED parameter order
    const seoData = createArticleSEOData(
      translation.seo_title || translation.title,
      translation.seo_description || translation.description || translation.lead || '',
      dictionary.seo.keywords.articles,
      canonicalUrl,
      safeDates.publishedTime,
      safeDates.modifiedTime,
      article.authors[0]?.name || 'EventForMe Editorial',
      params.rubric,
      [params.rubric],
      imageUrl
    );

    // Validate and build metadata
    if (!validateSEOData(seoData)) {
      console.warn('SEO data validation failed for article:', params.slug);
    }

    return buildMetadata(seoData);

  } catch (error) {
    console.error('Error generating article metadata:', error);
    
    // Fallback metadata
    return {
      title: 'Статья — EventForMe',
      description: 'Читайте интересные статьи о культуре и искусстве на EventForMe.',
    };
  }
}

/**
 * Article page component
 */
export default async function ArticlePage({ 
  params,
  searchParams 
}: { 
  params: { rubric: string, slug: string },
  searchParams: { author?: string }
}) {
  try {
    const [dictionary, article, rubricBasics] = await Promise.all([
      getDictionary('ru'),
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

    // Handle dates safely
    const safeDates = getSafeArticleDates(
      article.published_at, 
      article.updated_at
    );

    // Format publication date for display
    const publishedDate = new Date(article.published_at);
    const formattedDate = publishedDate.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Process article content properly using the existing markdown processing system
    const rawContent = translation.article_body
      ? translation.article_body.map(block => block.item.content).join('\n\n')
      : '';

    // Use the project's sophisticated markdown processing
    const processedContent = await processContent(rawContent);
    const { chunks: contentChunks, toc: tocItems } = processedContent;

    // Convert article authors to proper AuthorDetails format
    const authorsWithDetails = article.authors.map(author => ({
      ...author,
      bio: '', // FullArticle doesn't include bio, so provide empty default
      avatar: '', // FullArticle doesn't include avatar, so provide empty default
    }));

    // Build breadcrumb items
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        label: dictionary.navigation.labels.rubrics,
        href: '/ru/rubrics',
      },
      {
        label: article.rubric_slug || params.rubric,
        href: `/ru/${params.rubric}`,
      },
      {
        label: translation.title,
        href: `/ru/${params.rubric}/${params.slug}`,
      },
    ];

    // Generate structured data
    const canonicalUrl = `${dictionary.seo.site.url}/ru/${params.rubric}/${params.slug}`;
    const imageUrl = article.article_heading_img 
      ? `${dictionary.seo.site.url.replace(/\/$/, '')}/assets/${article.article_heading_img}`
      : undefined;

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": canonicalUrl,
      "headline": translation.title,
      "description": translation.description || translation.lead || '',
      "url": canonicalUrl,
      "datePublished": safeDates.publishedTime,
      "dateModified": safeDates.modifiedTime,
      "inLanguage": "ru",
      "author": {
        "@type": "Person",
        "name": article.authors[0]?.name || 'EventForMe Editorial',
        ...(article.authors[0]?.slug && {
          "url": `${dictionary.seo.site.url}/ru/authors/${article.authors[0].slug}`,
        }),
      },
      "publisher": {
        "@type": "Organization",
        "name": dictionary.seo.site.name,
        "url": dictionary.seo.site.url,
        "logo": {
          "@type": "ImageObject",
          "url": `${dictionary.seo.site.url}/logo.png`,
          "width": 200,
          "height": 80,
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      ...(imageUrl && {
        "image": {
          "@type": "ImageObject",
          "url": imageUrl,
          "width": 1200,
          "height": 630,
        },
      }),
      "articleSection": params.rubric,
      "keywords": [params.rubric, ...(translation.title.split(' ').slice(0, 3))],
    };

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema, null, 0)
          }}
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
                {/* Article Header */}
                <Header
                  title={translation.title}
                  lead={translation.lead}
                  imagePath={article.article_heading_img}
                  authors={authorsWithDetails}
                  publishedDate={formattedDate}
                  lang="ru"
                  editorialText={`Редакция ${dictionary.seo.site.name}`}
                />

                {/* Table of Contents */}
                {tocItems.length > 0 && (
                  <TableOfContents
                    items={tocItems}
                    title="Содержание"
                  />
                )}

                {/* Article Body */}
                <Content
                  chunks={contentChunks}
                  toc={tocItems}
                  title={translation.title}
                  author={article.authors[0]?.name || 'EventForMe Editorial'}
                  datePublished={safeDates.publishedTime}
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
    
    // Error fallback
    return (
      <Section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Ошибка загрузки статьи
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла ошибка при загрузке статьи. Попробуйте обновить страницу.
          </p>
          <a 
            href="/ru" 
            className="text-blue-600 hover:text-blue-800"
          >
            Вернуться на главную
          </a>
        </div>
      </Section>
    );
  }
}