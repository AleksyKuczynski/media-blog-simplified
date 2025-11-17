// app/api/images/warm/[slug]/route.ts
/**
 * Image Pre-warming API Route
 * 
 * Fetches all social media image variants for an article to warm the cache
 * 
 * Usage:
 * POST /api/images/warm/article-slug
 * 
 * This ensures Facebook, Twitter, and other crawlers see cached images
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/main/lib/directus';
import { getSocialImageVariants } from '@/main/lib/utils/imageOptimization';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';

interface WarmResult {
  variant: 'og' | 'twitter' | 'vk';
  url: string;
  success: boolean;
  status?: number;
  size?: number;
  duration?: number;
  error?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    console.log(`[Image Warming] Starting for article: ${slug}`);

    // Fetch article to get image ID
    const article = await fetchFullArticle(slug, DEFAULT_LANG);

    if (!article) {
      return NextResponse.json({
        success: false,
        error: 'Article not found',
        slug,
      }, { status: 404 });
    }

    const imageId = article.article_heading_img;

    if (!imageId) {
      return NextResponse.json({
        success: false,
        error: 'Article has no image',
        slug,
        message: 'Article will use fallback image for social shares',
      }, { status: 200 });
    }

    // Get all social image variants
    const variants = getSocialImageVariants(imageId);
    
    console.log(`[Image Warming] Found image: ${imageId}`);
    console.log(`[Image Warming] Variants:`, variants);

    // Warm each variant by making HEAD requests
    const results: WarmResult[] = [];

    for (const [variant, url] of Object.entries(variants)) {
      const variantStartTime = Date.now();
      
      try {
        console.log(`[Image Warming] Fetching ${variant}: ${url}`);
        
        // Use HEAD request to minimize bandwidth
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Image-Warmer/1.0',
          },
        });

        const duration = Date.now() - variantStartTime;
        const size = parseInt(response.headers.get('content-length') || '0');

        results.push({
          variant: variant as 'og' | 'twitter' | 'vk',
          url,
          success: response.ok,
          status: response.status,
          size,
          duration,
        });

        if (response.ok) {
          console.log(`[Image Warming] ✅ ${variant} cached (${duration}ms, ${size} bytes)`);
        } else {
          console.error(`[Image Warming] ❌ ${variant} failed: ${response.status}`);
        }

      } catch (error) {
        const duration = Date.now() - variantStartTime;
        
        results.push({
          variant: variant as 'og' | 'twitter' | 'vk',
          url,
          success: false,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        console.error(`[Image Warming] ❌ ${variant} error:`, error);
      }
    }

    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;

    console.log(`[Image Warming] Complete: ${successCount}/${results.length} succeeded (${totalDuration}ms)`);

    return NextResponse.json({
      success: successCount > 0,
      article: {
        slug,
        title: article.translations[0]?.title,
        imageId,
      },
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalDuration,
      },
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('[Image Warming] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Also support GET for easier testing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return POST(request, { params });
}