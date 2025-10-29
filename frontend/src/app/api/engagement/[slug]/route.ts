// frontend/src/app/api/engagement/[slug]/route.ts
// FIXED: Now uses Directus Flow webhook for all counter updates

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const DIRECTUS_FLOW_ID = process.env.DIRECTUS_FLOW_INCREMENT_VIEWS;

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 15;

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

/**
 * Check rate limit for IP
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  // Cleanup old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
    return false;
  }

  clientData.count++;
  return true;
}

/**
 * Validate article exists (only for view action to reduce unnecessary Flow calls)
 */
async function validateArticleSlug(slug: string): Promise<boolean> {
  try {
    const filter = encodeURIComponent(JSON.stringify({ 
      slug: { _eq: slug },
      status: { _eq: 'published' }
    }));
    const url = `${DIRECTUS_URL}/items/articles?fields=slug&filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` }
        : undefined,
      next: { revalidate: 300 },
    });

    if (!response.ok) return false;
    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    console.error('Error validating slug:', error);
    return false;
  }
}

/**
 * Fetch current engagement data from Directus
 * Used to return updated counts after Flow execution
 */
async function fetchEngagementData(slug: string) {
  try {
    if (!DIRECTUS_API_TOKEN) {
      throw new Error('DIRECTUS_API_TOKEN not configured');
    }

    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
    });

    if (response.status === 401) {
      throw new Error('Authentication failed: Invalid or missing API token');
    }

    if (response.status === 403) {
      throw new Error('Permission denied: Token lacks required permissions');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Directus API error ${response.status}:`, errorText);
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return {
      article_slug: slug,
      view_count: 0,
      like_count: 0,
      share_count: 0,
    };
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    throw error;
  }
}

/**
 * CRITICAL: Trigger Directus Flow to update counters
 * This replaces all direct PATCH/POST operations
 */
async function triggerEngagementFlow(
  slug: string,
  action: 'view' | 'like' | 'unlike' | 'share'
): Promise<boolean> {
  try {
    if (!DIRECTUS_FLOW_ID) {
      console.error('❌ DIRECTUS_FLOW_ID not configured');
      return false;
    }

    if (!DIRECTUS_API_TOKEN) {
      console.error('❌ DIRECTUS_API_TOKEN not configured');
      return false;
    }

    const flowUrl = `${DIRECTUS_URL}/flows/trigger/${DIRECTUS_FLOW_ID}`;
    
    console.log(`🔄 Triggering Flow for ${action}:`, slug);

    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify({
        slug,
        action,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Flow execution failed (${response.status}):`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`✅ Flow executed successfully for ${action}:`, slug, result);
    
    return true;
  } catch (error) {
    console.error(`❌ Error triggering Flow:`, error);
    return false;
  }
}

// ===================================================================
// API ROUTE HANDLERS
// ===================================================================

/**
 * GET /api/engagement/[slug]
 * Fetch current engagement data
 */
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

    const engagement = await fetchEngagementData(slug);

    const response = NextResponse.json({
      success: true,
      data: {
        slug: engagement.article_slug,
        views: engagement.view_count || 0,
        likes: engagement.like_count || 0,
        shares: engagement.share_count || 0,
      },
    });

    // Prevent caching to avoid stale data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('GET /api/engagement error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/engagement/[slug]
 * Trigger Flow to update engagement counters
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    // Validate inputs
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    if (!action || !['view', 'like', 'unlike', 'share'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be: view, like, unlike, or share' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Check configuration
    if (!DIRECTUS_API_TOKEN || !DIRECTUS_FLOW_ID) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'Flow or API token not configured',
        },
        { status: 500 }
      );
    }

    // Validate article exists (only for view action to save API calls)
    if (action === 'view') {
      const isValidSlug = await validateArticleSlug(slug);
      if (!isValidSlug) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    // Trigger Directus Flow
    const success = await triggerEngagementFlow(slug, action);

    if (!success) {
      return NextResponse.json(
        { 
          error: 'Failed to update engagement counter',
          message: 'Flow execution failed',
        },
        { status: 500 }
      );
    }

    // Fetch updated engagement data
    // Small delay to ensure Flow has completed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const updatedEngagement = await fetchEngagementData(slug);

    const response = NextResponse.json({
      success: true,
      action,
      data: {
        slug: updatedEngagement.article_slug,
        views: updatedEngagement.view_count || 0,
        likes: updatedEngagement.like_count || 0,
        shares: updatedEngagement.share_count || 0,
      },
    });

    // Prevent caching mutation responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('POST /api/engagement error:', error);
    
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