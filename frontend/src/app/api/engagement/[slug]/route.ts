import { fetchEngagementData } from '@/main/lib/directus';
import { checkRateLimit, hasRecentlyViewed, triggerEngagementFlow } from '@/app/[lang]/[rubric]/[slug]/_components/engagement/lib';
import { getClientIP, validateArticleSlug } from '@/main/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!DIRECTUS_API_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'API token not configured',
        },
        { status: 500 }
      );
    }

    // Validate article exists
    const isValidArticle = await validateArticleSlug(slug);
    if (!isValidArticle) {
      console.warn(`⚠️ Article not found: ${slug}`);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // 1. FETCH DATA FIRST (get current counts + timestamp)
    const engagement = await fetchEngagementData(slug);

    // 2. CHECK SESSION and TRIGGER FLOW if first view
    const alreadyViewed = hasRecentlyViewed(clientIP, slug);
    let viewTracked = false;
    
    if (!alreadyViewed) {
      // ONLY log when we're actually triggering the Flow
      console.log(`🆕 [${slug}] First view from ${clientIP} - triggering Flow`);
      viewTracked = true;
      
      // Trigger Flow without waiting (fire-and-forget)
      triggerEngagementFlow(slug, 'view');
    }
    // REMOVED: No logging for repeat visits (reduces noise)

    // 3. RETURN DATA + viewTracked flag + last_updated timestamp
    const responseData = {
      success: true,
      data: {
        slug: engagement.article_slug,
        views: engagement.view_count || 0,
        likes: engagement.like_count || 0,
        shares: engagement.share_count || 0,
        last_updated: engagement.date_updated || null,
      },
      viewTracked,
    };

    const response = NextResponse.json(responseData);

    // Add custom headers for debugging
    response.headers.set('X-View-Tracked', viewTracked ? 'true' : 'false');
    response.headers.set('X-Session-Key', `${clientIP}:${slug}`.substring(0, 20)); // Truncated for privacy
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
    
  } catch (error) {
    console.error('❌ GET /api/engagement error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch engagement data',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/engagement/[slug]
 * Handle like, unlike, and share actions
 * Fire-and-forget - returns immediately
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body as { action: 'like' | 'unlike' | 'share' };

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    // Note: 'view' action should use GET endpoint, not POST
    if (!action || !['like', 'unlike', 'share'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: like, unlike, or share' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (!DIRECTUS_API_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'API token not configured',
        },
        { status: 500 }
      );
    }

    // Validate article exists
    const isValidArticle = await validateArticleSlug(slug);
    if (!isValidArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Trigger Flow (fire-and-forget)
    triggerEngagementFlow(slug, action);
    
    // Log engagement actions (useful for monitoring)
    console.log(`✅ [${slug}] ${action} from ${clientIP}`);

    // Return immediately - client uses optimistic updates
    return NextResponse.json({
      success: true,
      action,
      message: 'Engagement action triggered',
    });
    
  } catch (error) {
    console.error('❌ POST /api/engagement error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
