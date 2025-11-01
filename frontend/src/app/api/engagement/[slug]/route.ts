// frontend/src/app/api/engagement/[slug]/route.ts
// REFACTORED: Fire-and-forget optimistic updates, no waiting for DB

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

// Separate flows for each action
const DIRECTUS_FLOW_VIEWS = process.env.DIRECTUS_FLOW_INCREMENT_VIEWS;
const DIRECTUS_FLOW_INCREMENT_LIKES = process.env.DIRECTUS_FLOW_INCREMENT_LIKES;
const DIRECTUS_FLOW_DECREMENT_LIKES = process.env.DIRECTUS_FLOW_DECREMENT_LIKES;
const DIRECTUS_FLOW_SHARES = process.env.DIRECTUS_FLOW_INCREMENT_SHARES;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  // Cleanup old entries
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

async function validateArticleSlug(slug: string): Promise<boolean> {
  try {
    const filter = encodeURIComponent(JSON.stringify({ 
      slug: { _eq: slug },
      status: { _eq: 'published' }
    }));
    const url = `${DIRECTUS_URL}/items/articles?fields=slug&filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { 'Authorization': `Bearer ${DIRECTUS_API_TOKEN}` }
        : {},
      cache: 'no-store',
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch (error) {
    console.error('Error validating article slug:', error);
    return false;
  }
}

/**
 * Fetch engagement data from Directus
 * Used by GET endpoint
 */
async function fetchEngagementData(slug: string) {
  try {
    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    // Return default structure if no record exists
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
 * Trigger Directus Flow for engagement action
 * SIMPLIFIED: Fire-and-forget, no waiting
 */
async function triggerEngagementFlow(
  slug: string,
  action: 'view' | 'like' | 'unlike' | 'share'
): Promise<boolean> {
  try {
    let flowId: string | undefined;
    let flowName: string;
    
    // Route to correct flow based on action
    switch (action) {
      case 'view':
        flowId = DIRECTUS_FLOW_VIEWS;
        flowName = 'Views Flow';
        break;
      case 'like':
        flowId = DIRECTUS_FLOW_INCREMENT_LIKES;
        flowName = 'Increment Likes Flow';
        break;
      case 'unlike':
        flowId = DIRECTUS_FLOW_DECREMENT_LIKES;
        flowName = 'Decrement Likes Flow';
        break;
      case 'share':
        flowId = DIRECTUS_FLOW_SHARES;
        flowName = 'Shares Flow';
        break;
    }

    if (!flowId) {
      console.error(`❌ ${flowName} ID not configured for action: ${action}`);
      return false;
    }

    if (!DIRECTUS_API_TOKEN) {
      console.error('❌ DIRECTUS_API_TOKEN not configured');
      return false;
    }

    const flowUrl = `${DIRECTUS_URL}/flows/trigger/${flowId}`;
    const payload = { slug };

    console.log('='.repeat(60));
    console.log('FLOW TRIGGER');
    console.log('='.repeat(60));
    console.log('Flow Name:', flowName);
    console.log('Flow ID:', flowId);
    console.log('Action:', action);
    console.log('Slug:', slug);
    console.log('-'.repeat(60));

    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    console.log('Response Status:', response.status);
    console.log('='.repeat(60));

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`❌ ${flowName} execution failed`);
      console.error('Response:', responseText);
      return false;
    }

    console.log(`✅ ${flowName} triggered successfully`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error triggering Flow:`, error);
    return false;
  }
}

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
 * Trigger engagement action (view, like, unlike, share)
 * REFACTORED: Fire-and-forget, returns immediately without waiting for DB
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    console.log('📥 POST /api/engagement received:', { slug, action });

    // Validation
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

    // Configuration checks
    if (!DIRECTUS_API_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'API token not configured',
        },
        { status: 500 }
      );
    }

    if (action === 'like' && !DIRECTUS_FLOW_INCREMENT_LIKES) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'DIRECTUS_FLOW_INCREMENT_LIKES not configured',
        },
        { status: 500 }
      );
    }

    if (action === 'unlike' && !DIRECTUS_FLOW_DECREMENT_LIKES) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: 'DIRECTUS_FLOW_DECREMENT_LIKES not configured',
        },
        { status: 500 }
      );
    }

    // Validate article exists (for view actions only)
    if (action === 'view') {
      const isValidSlug = await validateArticleSlug(slug);
      if (!isValidSlug) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    // Trigger Flow (fire-and-forget)
    console.log('🚀 Triggering Flow...');
    const success = await triggerEngagementFlow(slug, action);

    // CHANGED: Return immediately without waiting or fetching
    // Client will use optimistic updates
    const response = NextResponse.json({
      success,
      action,
      message: success 
        ? 'Engagement action triggered' 
        : 'Flow trigger failed, but request accepted',
    });

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