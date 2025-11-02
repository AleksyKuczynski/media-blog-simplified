// frontend/src/app/api/engagement/[slug]/route.ts
// FIXED: Fire Increment Views Flow during GET request for immediate counter display
// ARCHITECTURE: GET request now triggers view tracking, eliminating the delay

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

// Session tracking to prevent duplicate view counts within same session
const viewTrackingMap = new Map<string, number>();
const VIEW_TRACKING_WINDOW = 3600 * 1000; // 1 hour

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

/**
 * Check if this slug was already viewed in this session
 * Prevents duplicate view tracking within 1 hour
 */
function hasRecentlyViewed(ip: string, slug: string): boolean {
  const now = Date.now();
  const key = `${ip}:${slug}`;
  
  // Cleanup old entries
  if (viewTrackingMap.size > 1000) {
    for (const [k, timestamp] of viewTrackingMap.entries()) {
      if (now - timestamp > VIEW_TRACKING_WINDOW) {
        viewTrackingMap.delete(k);
      }
    }
  }
  
  const lastViewTime = viewTrackingMap.get(key);
  
  if (lastViewTime && (now - lastViewTime) < VIEW_TRACKING_WINDOW) {
    return true;
  }
  
  viewTrackingMap.set(key, now);
  return false;
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
 * Used by GET endpoint AFTER view has been tracked
 */
async function fetchEngagementData(slug: string) {
  try {
    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    console.log('📊 Fetching engagement data for:', slug);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Directus API Error:', errorText);
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const record = data.data[0];
      console.log('✅ Found engagement record:', {
        slug: record.article_slug,
        views: record.view_count,
        likes: record.like_count,
        shares: record.share_count,
      });
      return record;
    }

    // IMPORTANT: If no record exists, Flow will create it with view_count=1
    // So we should never see this, but return default just in case
    console.warn('⚠️ No record found (Flow should have created it)');
    return {
      article_slug: slug,
      view_count: 0,
      like_count: 0,
      share_count: 0,
    };
  } catch (error) {
    console.error('❌ Error fetching engagement data:', error);
    throw error;
  }
}

/**
 * Trigger Directus Flow for engagement action
 */
async function triggerEngagementFlow(
  slug: string,
  action: 'view' | 'like' | 'unlike' | 'share'
): Promise<boolean> {
  try {
    let flowId: string | undefined;
    let flowName: string;
    
    switch (action) {
      case 'view':
        flowId = DIRECTUS_FLOW_VIEWS;
        flowName = 'Increment Views';
        break;
      case 'like':
        flowId = DIRECTUS_FLOW_INCREMENT_LIKES;
        flowName = 'Increment Likes';
        break;
      case 'unlike':
        flowId = DIRECTUS_FLOW_DECREMENT_LIKES;
        flowName = 'Decrement Likes';
        break;
      case 'share':
        flowId = DIRECTUS_FLOW_SHARES;
        flowName = 'Increment Shares';
        break;
    }

    if (!flowId) {
      console.error(`❌ ${flowName} Flow ID not configured`);
      return false;
    }

    const flowUrl = `${DIRECTUS_URL}/flows/trigger/${flowId}`;
    const payload = { slug };

    console.log(`🚀 Triggering ${flowName} Flow for:`, slug);

    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`❌ ${flowName} Flow failed:`, responseText);
      return false;
    }

    console.log(`✅ ${flowName} Flow triggered successfully`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error triggering ${action} Flow:`, error);
    return false;
  }
}

/**
 * GET /api/engagement/[slug]
 * FIXED: Now fires Increment Views Flow BEFORE fetching data
 * 
 * BEHAVIOR:
 * 1. Check if slug already viewed in this session → Skip if yes
 * 2. Trigger Increment Views Flow (creates/updates record)
 * 3. Wait briefly for Flow to complete
 * 4. Fetch fresh engagement data
 * 5. Return data with view already counted
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    console.log('\n' + '='.repeat(70));
    console.log('GET /api/engagement/[slug]');
    console.log('='.repeat(70));
    console.log('Slug:', slug);
    console.log('Timestamp:', new Date().toISOString());

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    console.log('Client IP:', clientIP);
    
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

    // Check if article exists
    const isValidArticle = await validateArticleSlug(slug);
    if (!isValidArticle) {
      console.warn('⚠️ Article not found:', slug);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // CRITICAL: Check if already viewed in this session
    const alreadyViewed = hasRecentlyViewed(clientIP, slug);
    
    if (!alreadyViewed) {
      console.log('🆕 First view in this session - triggering Flow');
      
      // 1. Trigger Increment Views Flow
      const flowTriggered = await triggerEngagementFlow(slug, 'view');
      
      if (flowTriggered) {
        // 2. Small delay to let Flow complete (100ms)
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        console.warn('⚠️ Flow trigger failed, but continuing with fetch');
      }
    } else {
      console.log('♻️ Already viewed in this session - skipping Flow');
    }

    // 3. Fetch fresh engagement data (now includes the new view if Flow succeeded)
    const engagement = await fetchEngagementData(slug);

    const responseData = {
      success: true,
      data: {
        slug: engagement.article_slug,
        views: engagement.view_count || 0,
        likes: engagement.like_count || 0,
        shares: engagement.share_count || 0,
      },
      viewTracked: !alreadyViewed, // Inform client if view was tracked
    };

    console.log('✅ Response:', JSON.stringify(responseData, null, 2));
    console.log('='.repeat(70) + '\n');

    const response = NextResponse.json(responseData);

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

    console.log('\n' + '='.repeat(70));
    console.log('POST /api/engagement/[slug]');
    console.log('='.repeat(70));
    console.log('Slug:', slug);
    console.log('Action:', action);
    console.log('Timestamp:', new Date().toISOString());

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
    const flowTriggered = await triggerEngagementFlow(slug, action);

    console.log('✅ POST complete - Flow triggered:', flowTriggered);
    console.log('='.repeat(70) + '\n');

    // Return immediately - client uses optimistic updates
    return NextResponse.json({
      success: flowTriggered,
      action,
      message: flowTriggered 
        ? 'Engagement action triggered successfully' 
        : 'Flow trigger failed',
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