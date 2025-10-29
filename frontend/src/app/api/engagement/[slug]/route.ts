// frontend/src/app/api/engagement/[slug]/route.ts
// FIXED: Handles race condition when record is created between check and insert

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
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

/**
 * Fetch engagement data from Directus
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
 * Read existing engagement record
 */
async function readEngagementRecord(slug: string) {
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
    return null;
  }

  const data = await response.json();
  return data.data && data.data.length > 0 ? data.data[0] : null;
}

/**
 * Increment view count - FIXED: Handles race conditions
 */
async function incrementViewCount(slug: string): Promise<boolean> {
  try {
    if (!DIRECTUS_API_TOKEN) {
      console.error('❌ DIRECTUS_API_TOKEN is required');
      return false;
    }

    console.log('🔍 Checking for existing record:', slug);

    // Step 1: Try to read existing record
    let existingRecord = await readEngagementRecord(slug);

    if (existingRecord) {
      // Record exists - update it
      console.log('📝 Updating existing record ID:', existingRecord.id);

      const updateUrl = `${DIRECTUS_URL}/items/articles_engagement/${existingRecord.id}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
        },
        body: JSON.stringify({
          view_count: (existingRecord.view_count || 0) + 1,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('❌ Failed to update:', updateResponse.status, errorText);
        return false;
      }

      const updated = await updateResponse.json();
      console.log('✅ Record updated:', {
        id: updated.data.id,
        views: updated.data.view_count,
      });
      return true;

    } else {
      // Record doesn't exist - try to create it
      console.log('➕ Creating new record for:', slug);

      const createUrl = `${DIRECTUS_URL}/items/articles_engagement`;
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
        },
        body: JSON.stringify({
          article_slug: slug,
          view_count: 1,
          like_count: 0,
          share_count: 0,
        }),
      });

      // FIXED: Handle race condition where another request created the record
      if (createResponse.status === 400) {
        const errorData = await createResponse.json();
        
        // Check if error is "record not unique"
        if (errorData.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log('⚠️  Record was created by another request - retrying update');
          
          // Re-read the record that was just created
          existingRecord = await readEngagementRecord(slug);
          
          if (existingRecord) {
            // Now update it
            const updateUrl = `${DIRECTUS_URL}/items/articles_engagement/${existingRecord.id}`;
            const updateResponse = await fetch(updateUrl, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${DIRECTUS_API_TOKEN}`,
              },
              body: JSON.stringify({
                view_count: (existingRecord.view_count || 0) + 1,
              }),
            });

            if (updateResponse.ok) {
              const updated = await updateResponse.json();
              console.log('✅ Record updated after retry:', {
                id: updated.data.id,
                views: updated.data.view_count,
              });
              return true;
            }
          }
          
          console.error('❌ Failed to recover from race condition');
          return false;
        }
        
        // Different 400 error
        console.error('❌ Failed to create:', errorData);
        return false;
      }

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('❌ Failed to create:', createResponse.status, errorText);
        return false;
      }

      const created = await createResponse.json();
      console.log('✅ Record created:', {
        id: created.data.id,
        views: created.data.view_count,
      });
      return true;
    }
  } catch (error) {
    console.error('❌ Error in incrementViewCount:', error);
    return false;
  }
}

// ===================================================================
// API ROUTE HANDLERS
// ===================================================================

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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Authentication failed')) {
      return NextResponse.json(
        { 
          error: 'Authentication error',
          message: 'Invalid or missing API token',
        },
        { status: 500 }
      );
    }

    if (errorMessage.includes('Permission denied')) {
      return NextResponse.json(
        { 
          error: 'Permission error',
          message: 'API token lacks required permissions',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch engagement data' },
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

    if (action === 'view') {
      const isValidSlug = await validateArticleSlug(slug);
      if (!isValidSlug) {
        return NextResponse.json(
          { error: 'Article not found' },
          { status: 404 }
        );
      }
    }

    let success = false;

    switch (action) {
      case 'view':
        success = await incrementViewCount(slug);
        break;

      case 'like':
        // TODO: Implement like functionality
        success = true;
        console.log('Like action - not yet implemented');
        break;

      case 'unlike':
        // TODO: Implement unlike functionality
        success = true;
        console.log('Unlike action - not yet implemented');
        break;

      case 'share':
        // TODO: Implement share functionality
        success = true;
        console.log('Share action - not yet implemented');
        break;
    }

    if (!success) {
      return NextResponse.json(
        { 
          error: 'Failed to update engagement counter',
        },
        { status: 500 }
      );
    }

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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';