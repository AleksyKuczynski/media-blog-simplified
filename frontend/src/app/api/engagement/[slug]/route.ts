// frontend/src/app/api/engagement/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const FLOW_INCREMENT_VIEWS = process.env.DIRECTUS_FLOW_INCREMENT_VIEWS;

// Rate limiting configuration (in-memory for dev, use Redis for prod)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

/**
 * Get client IP address for rate limiting
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientData.count++;
  return true;
}

/**
 * Validate article slug exists in Directus
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
      next: { revalidate: 300 }, // Cache for 5 minutes
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
 * Fetch engagement data from Directus
 */
async function fetchEngagementData(slug: string) {
  try {
    const filter = encodeURIComponent(
      JSON.stringify({ article_slug: { _eq: slug } })
    );
    const url = `${DIRECTUS_URL}/items/articles_engagement?filter=${filter}&limit=1`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` }
        : undefined,
      cache: 'no-store', // Always get fresh engagement data
    });

    if (!response.ok) {
      throw new Error(`Directus API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    // Return default values if no record exists
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
 * Call Directus Flow to update engagement
 */
async function callDirectusFlow(slug: string): Promise<boolean> {
  try {
    if (!FLOW_INCREMENT_VIEWS) {
      console.error('DIRECTUS_FLOW_INCREMENT_VIEWS not configured');
      return false;
    }

    const response = await fetch(
      `${DIRECTUS_URL}/flows/trigger/${FLOW_INCREMENT_VIEWS}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(DIRECTUS_API_TOKEN && { 
            Authorization: `Bearer ${DIRECTUS_API_TOKEN}` 
          }),
        },
        body: JSON.stringify({ slug }),
      }
    );

    if (!response.ok) {
      console.error(`Flow returned ${response.status}:`, await response.text());
    }

    return response.ok;
  } catch (error) {
    console.error('Error calling flow:', error);
    return false;
  }
}

// ===================================================================
// API ROUTE HANDLERS
// ===================================================================

/**
 * GET /api/engagement/[slug]
 * Fetch engagement data for an article
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Basic validation
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
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

    // Fetch engagement data
    const engagement = await fetchEngagementData(slug);

    return NextResponse.json({
      success: true,
      data: {
        slug: engagement.article_slug,
        views: engagement.view_count || 0,
        likes: engagement.like_count || 0,
        shares: engagement.share_count || 0,
      },
    });
  } catch (error) {
    console.error('GET /api/engagement error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/engagement/[slug]
 * Update engagement counters
 * Body: { action: 'view' | 'like' | 'unlike' | 'share' }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body;

    // Validation
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 }
      );
    }

    const validActions = ['view', 'like', 'unlike', 'share'];
    if (!action || !validActions.includes(action)) {
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

    // Validate article exists (only for first-time actions to save API calls)
    if (action === 'view') {
      const isValidSlug = await validateArticleSlug(slug);
      if (!isValidSlug) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    // Execute action
    let success = false;

    switch (action) {
      case 'view':
        success = await callDirectusFlow(slug); // Simplified!
        break;

      case 'like':
        // TODO: Create like Flow
        success = true;
        console.log('Like action - flow not yet created');
        break;

      case 'unlike':
        // TODO: Create unlike Flow
        success = true;
        console.log('Unlike action - flow not yet created');
        break;

      case 'share':
        // TODO: Create share Flow
        success = true;
        console.log('Share action - flow not yet created');
        break;
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update engagement counter' },
        { status: 500 }
      );
    }

    // Fetch updated data
    const updatedEngagement = await fetchEngagementData(slug);

    return NextResponse.json({
      success: true,
      action,
      data: {
        slug: updatedEngagement.article_slug,
        views: updatedEngagement.view_count || 0,
        likes: updatedEngagement.like_count || 0,
        shares: updatedEngagement.share_count || 0,
      },
    });
  } catch (error) {
    console.error('POST /api/engagement error:', error);
    return NextResponse.json(
      { error: 'Failed to update engagement data' },
      { status: 500 }
    );
  }
}

// Configure route segment
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';