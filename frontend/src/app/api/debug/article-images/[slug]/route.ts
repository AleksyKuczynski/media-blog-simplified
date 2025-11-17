// app/api/debug/article-images/[slug]/route.ts
/**
 * Simple Image Debug Route
 * 
 * Test with: https://YOUR_DOMAIN/api/debug/article-images/YOUR_ARTICLE_SLUG
 * 
 * Checks if article has image and if URL generation works
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/main/lib/directus';
import { getOptimizedImageUrl, isValidAssetId } from '@/main/lib/utils/imageOptimization';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    
    console.log('=== Image Debug Request ===');
    console.log('Article slug:', resolvedParams.slug);
    
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
    const imageId = article.article_heading_img;

    console.log('Image ID from database:', imageId);
    console.log('Image ID type:', typeof imageId);
    console.log('Image ID is null:', imageId === null);
    console.log('Image ID is undefined:', imageId === undefined);

    // Check if valid UUID
    const isValid = isValidAssetId(imageId);
    console.log('Is valid UUID:', isValid);

    // Generate URLs for all social platforms
    const ogImageUrl = imageId 
      ? getOptimizedImageUrl(imageId, 'og', true)
      : `${dictionary.seo.site.url}/og-default.jpg`;
    
    const twitterImageUrl = imageId
      ? getOptimizedImageUrl(imageId, 'twitter', true)
      : `${dictionary.seo.site.url}/og-default.jpg`;

    const vkImageUrl = imageId
      ? getOptimizedImageUrl(imageId, 'vk', true)
      : `${dictionary.seo.site.url}/og-default.jpg`;

    console.log('Generated OG URL:', ogImageUrl);
    console.log('Generated Twitter URL:', twitterImageUrl);
    console.log('Generated VK URL:', vkImageUrl);
    console.log('========================\n');

    // Test if image proxy works by making a HEAD request
    let proxyWorks = false;
    let proxyStatus = 0;
    
    if (imageId) {
      try {
        const testUrl = `${dictionary.seo.site.url}/api/images/assets/${imageId}?width=100&height=100`;
        const testResponse = await fetch(testUrl, { method: 'HEAD' });
        proxyWorks = testResponse.ok;
        proxyStatus = testResponse.status;
        console.log('Proxy test status:', proxyStatus);
      } catch (error) {
        console.error('Proxy test failed:', error);
      }
    }

    return NextResponse.json({
      article: {
        slug: resolvedParams.slug,
        title: translation?.title || 'N/A',
        rubric: article.rubric_slug,
      },
      imageData: {
        rawImageId: imageId,
        imageIdType: typeof imageId,
        isNull: imageId === null,
        isUndefined: imageId === undefined,
        isEmpty: !imageId,
        isValidUUID: isValid,
      },
      environment: {
        SITE_URL: process.env.SITE_URL || dictionary.seo.site.url,
        DIRECTUS_URL: process.env.DIRECTUS_URL || 'NOT SET',
        hasDirectusToken: !!process.env.DIRECTUS_API_TOKEN,
        tokenLength: process.env.DIRECTUS_API_TOKEN?.length || 0,
      },
      generatedUrls: {
        openGraph: ogImageUrl,
        twitter: twitterImageUrl,
        vk: vkImageUrl,
        usingFallback: !imageId,
      },
      proxyTest: {
        tested: !!imageId,
        works: proxyWorks,
        status: proxyStatus,
        url: imageId ? `${dictionary.seo.site.url}/api/images/assets/${imageId}?width=100&height=100` : null,
      },
      recommendation: !imageId 
        ? '⚠️ Article has no image assigned in Directus. Set article_heading_img field.'
        : !isValid
        ? '⚠️ Image ID is not a valid UUID format.'
        : !proxyWorks
        ? '⚠️ Image exists but proxy cannot fetch it. Check DIRECTUS_API_TOKEN.'
        : '✅ Everything looks good! Check if metadata is being generated correctly.',
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Image debug error:', error);
    
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