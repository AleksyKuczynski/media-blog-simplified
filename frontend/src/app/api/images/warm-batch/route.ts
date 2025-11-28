// app/api/images/warm-batch/route.ts
/**
 * Batch Image Pre-warming API Route
 * 
 * Warms images for multiple articles at once
 * 
 * Usage:
 * POST /api/images/warm-batch
 * Body: { "slugs": ["article-1", "article-2"], "limit": 10 }
 * 
 * Or warm all recent articles:
 * POST /api/images/warm-batch?recent=20
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchArticleSlugs, fetchFullArticle } from '@/api/directus';
import { getSocialImageVariants } from '@/lib/utils/imageOptimization';
import { DEFAULT_LANG } from '@/config/constants/constants';

interface BatchWarmOptions {
  slugs?: string[];
  limit?: number;
  recentOnly?: boolean;
}

interface ArticleWarmResult {
  slug: string;
  title?: string;
  success: boolean;
  imageId?: string;
  variantsWarmed: number;
  duration: number;
  error?: string;
}

async function warmArticleImages(slug: string): Promise<ArticleWarmResult> {
  const startTime = Date.now();
  
  try {
    const article = await fetchFullArticle(slug, DEFAULT_LANG);

    if (!article) {
      return {
        slug,
        success: false,
        variantsWarmed: 0,
        duration: Date.now() - startTime,
        error: 'Article not found',
      };
    }

    const imageId = article.article_heading_img;
    const title = article.translations[0]?.title;

    if (!imageId) {
      return {
        slug,
        title,
        success: true,
        variantsWarmed: 0,
        duration: Date.now() - startTime,
        error: 'No image (will use fallback)',
      };
    }

    // Get all variants
    const variants = getSocialImageVariants(imageId);
    let warmedCount = 0;

    // Warm each variant
    for (const url of Object.values(variants)) {
      try {
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Image-Warmer-Batch/1.0',
          },
        });

        if (response.ok) {
          warmedCount++;
        }
      } catch (error) {
        console.error(`Failed to warm ${url}:`, error);
      }
    }

    return {
      slug,
      title,
      success: warmedCount > 0,
      imageId,
      variantsWarmed: warmedCount,
      duration: Date.now() - startTime,
    };

  } catch (error) {
    return {
      slug,
      success: false,
      variantsWarmed: 0,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const recentParam = searchParams.get('recent');

    let body: BatchWarmOptions = {};
    try {
      body = await request.json();
    } catch {
      // No body, use query params
    }

    let slugsToWarm: string[] = [];

    // Determine which articles to warm
    if (body.slugs && body.slugs.length > 0) {
      // Explicit list of slugs
      slugsToWarm = body.slugs;
      console.log(`[Batch Warming] Warming ${slugsToWarm.length} specific articles`);
      
    } else if (recentParam || body.recentOnly) {
      // Warm recent articles
      const limit = recentParam ? parseInt(recentParam) : (body.limit || 20);
      console.log(`[Batch Warming] Fetching ${limit} recent articles`);
      
      const { slugs } = await fetchArticleSlugs(1, 'desc', DEFAULT_LANG);
      slugsToWarm = slugs.slice(0, limit).map(s => s.slug);
      
    } else {
      return NextResponse.json({
        success: false,
        error: 'No articles specified',
        message: 'Provide either "slugs" array or "recent" query parameter',
        examples: {
          specific: { slugs: ['article-1', 'article-2'] },
          recent: '/api/images/warm-batch?recent=10',
        },
      }, { status: 400 });
    }

    if (slugsToWarm.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No articles to warm',
      }, { status: 400 });
    }

    console.log(`[Batch Warming] Starting for ${slugsToWarm.length} articles`);

    // Warm articles with concurrency control (max 5 at a time)
    const results: ArticleWarmResult[] = [];
    const concurrency = 5;

    for (let i = 0; i < slugsToWarm.length; i += concurrency) {
      const batch = slugsToWarm.slice(i, i + concurrency);
      console.log(`[Batch Warming] Processing batch ${Math.floor(i / concurrency) + 1}`);
      
      const batchResults = await Promise.all(
        batch.map(slug => warmArticleImages(slug))
      );
      
      results.push(...batchResults);
    }

    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const totalVariants = results.reduce((sum, r) => sum + r.variantsWarmed, 0);

    console.log(`[Batch Warming] Complete: ${successCount}/${results.length} articles, ${totalVariants} variants (${totalDuration}ms)`);

    return NextResponse.json({
      success: successCount > 0,
      summary: {
        totalArticles: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalVariantsWarmed: totalVariants,
        totalDuration,
        averageDuration: Math.round(totalDuration / results.length),
      },
      results,
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('[Batch Warming] Error:', error);
    
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

// Support GET for warming recent articles
export async function GET(request: NextRequest) {
  return POST(request);
}