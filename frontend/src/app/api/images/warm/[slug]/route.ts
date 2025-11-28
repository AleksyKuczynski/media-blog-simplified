// app/api/images/warm/[slug]/route.ts
/**
 * Image Pre-warming API Route for Directus Flow
 * 
 * Fetches all social media image variants for an article to warm the cache
 * Called by Directus Flow when article_heading_img changes
 * 
 * Usage:
 * POST /api/images/warm/{article-slug}
 * Authorization: Bearer {DIRECTUS_API_TOKEN}
 * 
 * This ensures Facebook, Twitter, and other crawlers see cached images
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchFullArticle } from '@/api/directus';
import { getSocialImageVariants } from '@/lib/utils/imageOptimization';
import { DEFAULT_LANG } from '@/config/constants/constants';

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

interface WarmResult {
  variant: 'og' | 'twitter' | 'vk';
  url: string;
  success: boolean;
  status?: number;
  size?: number;
  duration?: number;
  error?: string;
}

/**
 * Verify request is authorized (from Directus)
 */
function verifyAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !DIRECTUS_API_TOKEN) {
    return false;
  }
  
  const token = authHeader.replace('Bearer ', '');
  return token === DIRECTUS_API_TOKEN;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const startTime = Date.now();
  
  try {
    // Verify authentication
    if (!verifyAuth(request)) {
      console.warn('[Image Warming] ⚠️ Unauthorized request');
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const { slug } = resolvedParams;

    console.log('\n=== IMAGE WARMING START ===');
    console.log(`Article: ${slug}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);

    // Fetch article to get image ID
    const article = await fetchFullArticle(slug, DEFAULT_LANG);

    if (!article) {
      console.log('❌ Article not found');
      console.log('=== IMAGE WARMING END ===\n');
      return NextResponse.json({
        success: false,
        error: 'Article not found',
        slug,
      }, { status: 404 });
    }

    const imageId = article.article_heading_img;
    const title = article.translations[0]?.title || 'Untitled';

    console.log(`Title: ${title}`);
    console.log(`Image ID: ${imageId || 'none'}`);

    if (!imageId) {
      console.log('ℹ️ Article has no image (will use fallback)');
      console.log('=== IMAGE WARMING END ===\n');
      return NextResponse.json({
        success: true,
        article: { slug, title },
        message: 'Article has no image - will use fallback for social shares',
        results: [],
      }, { status: 200 });
    }

    // Get all social image variants
    const variants = getSocialImageVariants(imageId);
    
    console.log('Warming variants:');
    console.log(`  - OG: ${variants.og}`);
    console.log(`  - Twitter: ${variants.twitter}`);
    console.log(`  - VK: ${variants.vk}`);

    // Warm each variant by making HEAD requests
    const results: WarmResult[] = [];

    for (const [variant, url] of Object.entries(variants)) {
      const variantStartTime = Date.now();
      
      try {
        // Use HEAD request to warm cache without downloading full image
        const response = await fetch(url, {
          method: 'HEAD',
          headers: {
            'User-Agent': 'Directus-Image-Warmer/1.0',
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
          console.log(`✅ ${variant}: cached (${duration}ms, ${(size / 1024).toFixed(1)}KB)`);
        } else {
          console.log(`❌ ${variant}: failed (status ${response.status})`);
        }

      } catch (error) {
        const duration = Date.now() - variantStartTime;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        
        results.push({
          variant: variant as 'og' | 'twitter' | 'vk',
          url,
          success: false,
          duration,
          error: errorMsg,
        });

        console.log(`❌ ${variant}: error - ${errorMsg}`);
      }
    }

    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0);

    console.log(`\nSummary: ${successCount}/${results.length} variants cached`);
    console.log(`Total size: ${(totalSize / 1024).toFixed(1)}KB`);
    console.log(`Total time: ${totalDuration}ms`);
    console.log('=== IMAGE WARMING END ===\n');

    return NextResponse.json({
      success: successCount > 0,
      article: {
        slug,
        title,
        imageId,
      },
      results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: results.length - successCount,
        totalDuration,
        totalSize,
      },
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error('[Image Warming] ❌ Unexpected error:', error);
    console.log('=== IMAGE WARMING END ===\n');
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      duration: totalDuration,
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Also support GET for manual testing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  console.log('[Image Warming] ℹ️ GET request - treating as POST');
  return POST(request, { params });
}