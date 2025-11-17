// app/api/debug/metadata/[slug]/route.ts
/**
 * Metadata Debug API Route
 * 
 * Test with: https://YOUR_DOMAIN/api/debug/metadata/YOUR_ARTICLE_SLUG
 * 
 * Returns detailed information about metadata generation for an article
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/main/lib/directus';
import generateArticleMetadata from '@/main/components/SEO/metadata/ArticleMetadata';
import { dictionary } from '@/main/lib/dictionary';
import { getOptimizedImageUrl } from '@/main/lib/utils/imageOptimization';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const article = await fetchFullArticle(resolvedParams.slug, DEFAULT_LANG);
    
    if (!article) {
      return NextResponse.json(
        { 
          error: 'Article not found',
          slug: resolvedParams.slug,
        },
        { status: 404 }
      );
    }

    const translation = article.translations[0];
    
    if (!translation) {
      return NextResponse.json(
        { 
          error: 'No translation found',
          slug: resolvedParams.slug,
        },
        { status: 404 }
      );
    }

    // Generate image URL separately for debugging
    const imageId = article.article_heading_img;
    const optimizedImageUrl = imageId 
      ? getOptimizedImageUrl(imageId, 'og')
      : `${dictionary.seo.site.url}/og-default.jpg`;

    // Generate metadata
    const metadata = generateArticleMetadata({
      dictionary,
      articleData: {
        title: translation.title,
        seoTitle: translation.seo_title,
        description: translation.description,
        seoDescription: translation.seo_description,
        lead: translation.lead,
        slug: resolvedParams.slug,
        rubricSlug: article.rubric_slug,
        author: article.authors[0]?.name || 'Editorial Team',
        publishedAt: article.published_at,
        updatedAt: article.updated_at,
        imageId: imageId,
        tags: article.categories?.map(c => c.name) || [],
      },
    });

    // Return detailed diagnostic information
    return NextResponse.json({
      article: {
        slug: resolvedParams.slug,
        title: translation.title,
        imageId: imageId,
        imageIdType: typeof imageId,
        imageIdIsNull: imageId === null,
        imageIdIsUndefined: imageId === undefined,
      },
      environment: {
        SITE_URL: process.env.SITE_URL || dictionary.seo.site.url,
        DIRECTUS_URL: process.env.DIRECTUS_URL,
        hasDirectusToken: !!process.env.DIRECTUS_API_TOKEN,
      },
      imageGeneration: {
        inputImageId: imageId,
        generatedImageUrl: optimizedImageUrl,
        usingFallback: !imageId,
        imageUrlLength: optimizedImageUrl?.length || 0,
      },
      generatedMetadata: {
        title: metadata.title,
        description: metadata.description,
        openGraph: {
          title: metadata.openGraph?.title,
          description: metadata.openGraph?.description,
          images: metadata.openGraph?.images,
          imagesCount: Array.isArray(metadata.openGraph?.images) 
            ? metadata.openGraph.images.length 
            : metadata.openGraph?.images ? 1 : 0,
        },
        twitter: {
          images: metadata.twitter?.images,
          imagesCount: Array.isArray(metadata.twitter?.images)
            ? metadata.twitter.images.length
            : metadata.twitter?.images ? 1 : 0,
        },
      },
      diagnosis: {
        hasImageId: !!imageId,
        hasImageUrl: !!optimizedImageUrl,
        hasOpenGraphImages: Array.isArray(metadata.openGraph?.images) 
          ? metadata.openGraph.images.length > 0
          : !!metadata.openGraph?.images,
        hasTwitterImages: Array.isArray(metadata.twitter?.images)
          ? metadata.twitter.images.length > 0
          : !!metadata.twitter?.images,
        status: (Array.isArray(metadata.openGraph?.images) 
          ? metadata.openGraph.images.length > 0
          : !!metadata.openGraph?.images) ? 'OK' : 'MISSING_IMAGES',
      },
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Metadata debug error:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}