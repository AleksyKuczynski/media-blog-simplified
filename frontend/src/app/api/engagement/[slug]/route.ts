// frontend/src/app/api/engagement/[slug]/route.ts
// DEBUG VERSION: Comprehensive logging to identify Flow issue

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

const DIRECTUS_FLOW_VIEWS = process.env.DIRECTUS_FLOW_INCREMENT_VIEWS;
const DIRECTUS_FLOW_LIKES = process.env.DIRECTUS_FLOW_INCREMENT_LIKES;
const DIRECTUS_FLOW_SHARES = process.env.DIRECTUS_FLOW_INCREMENT_SHARES;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 15;

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

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
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
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
 * DEBUG VERSION: Comprehensive logging
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
        flowName = 'Views Flow';
        break;
      case 'like':
      case 'unlike':
        flowId = DIRECTUS_FLOW_LIKES;
        flowName = 'Likes Flow';
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
    
    const payload: any = { slug };
    if (action === 'like' || action === 'unlike') {
      payload.action = action;
    }

    // === DEBUG LOGGING START ===
    console.log('='.repeat(60));
    console.log('FLOW DEBUG - Starting');
    console.log('='.repeat(60));
    console.log('Flow Name:', flowName);
    console.log('Flow ID:', flowId);
    console.log('Flow URL:', flowUrl);
    console.log('Action:', action);
    console.log('Slug:', slug);
    console.log('Slug Length:', slug.length);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('Token (first 10):', DIRECTUS_API_TOKEN?.substring(0, 10));
    console.log('-'.repeat(60));

    const startTime = Date.now();

    const response = await fetch(flowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const duration = Date.now() - startTime;

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    console.log('Duration:', `${duration}ms`);
    console.log('Response Headers:', JSON.stringify(
      Object.fromEntries(response.headers.entries()),
      null,
      2
    ));
    console.log('-'.repeat(60));

    const responseText = await response.text();
    console.log('Response Body (raw):', responseText.substring(0, 500));
    if (responseText.length > 500) {
      console.log(`... (truncated, total length: ${responseText.length})`);
    }
    console.log('-'.repeat(60));

    if (!response.ok) {
      console.error(`❌ ${flowName} execution failed`);
      console.error('Full response:', responseText);
      console.log('='.repeat(60));
      return false;
    }

    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Parsed Result:', JSON.stringify(result, null, 2));
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON');
      console.error('Parse Error:', parseError);
      console.log('='.repeat(60));
      // If response is OK but not JSON, might still be success
      return true;
    }

    // Check for errors in EVERY possible location
    const errorChecks = {
      'result.error': !!result.error,
      'result.name === "error"': result.name === 'error',
      'result.code === "22P02"': result.code === '22P02',
      'result.errors?.length > 0': result.errors?.length > 0,
      'result.data?.error': !!result.data?.error,
      'result.data?.name === "error"': result.data?.name === 'error',
      'result.data?.code === "22P02"': result.data?.code === '22P02',
      'responseText contains "error"': responseText.toLowerCase().includes('"name":"error"'),
      'responseText contains 22P02': responseText.includes('22P02'),
    };

    console.log('Error Checks:', JSON.stringify(errorChecks, null, 2));

    const hasError = Object.values(errorChecks).some(check => check);

    if (hasError) {
      console.error(`❌ ${flowName} returned error`);
      console.error('Error Details:', JSON.stringify(result, null, 2));
      console.log('='.repeat(60));
      return false;
    }
    
    console.log(`✅ ${flowName} executed successfully`);
    console.log('='.repeat(60));
    
    return true;
  } catch (error) {
    console.error(`❌ Error triggering Flow:`, error);
    console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack');
    console.log('='.repeat(60));
    return false;
  }
}

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    console.log('📥 POST /api/engagement received:', { slug, action });

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

    const requiredFlowVar = action === 'view' 
      ? 'DIRECTUS_FLOW_INCREMENT_VIEWS'
      : action === 'share'
      ? 'DIRECTUS_FLOW_INCREMENT_SHARES'
      : 'DIRECTUS_FLOW_INCREMENT_LIKES';
    
    const flowId = action === 'view' 
      ? DIRECTUS_FLOW_VIEWS
      : action === 'share'
      ? DIRECTUS_FLOW_SHARES
      : DIRECTUS_FLOW_LIKES;

    if (!flowId) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          message: `${requiredFlowVar} not configured`,
        },
        { status: 500 }
      );
    }

    if (action === 'view') {
      const isValidSlug = await validateArticleSlug(slug);
      if (!isValidSlug) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    console.log('🚀 Triggering Flow...');
    const success = await triggerEngagementFlow(slug, action);

    if (!success) {
      console.error('❌ Flow execution failed');
      return NextResponse.json(
        { 
          error: 'Failed to update engagement counter',
          message: 'Flow execution failed',
        },
        { status: 500 }
      );
    }

    console.log('⏳ Waiting for Flow to complete...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('📊 Fetching updated engagement data...');
    const updatedEngagement = await fetchEngagementData(slug);
    console.log('✅ Engagement data:', updatedEngagement);

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