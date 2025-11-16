// frontend/src/app/api/images/[...path]/route.ts
/**
 * Image Proxy API Route
 * 
 * Proxies Directus images through Next.js to provide HTTPS URLs
 * for social media sharing (WhatsApp, Telegram, Twitter, etc.)
 * 
 * Usage: https://event4me.vercel.app/api/images/assets/abc-123?width=1200&height=630
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    
    // Get query parameters (transformation params)
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Build Directus URL
    const directusUrl = queryString
      ? `${DIRECTUS_URL}/${path}?${queryString}`
      : `${DIRECTUS_URL}/${path}`;

    // Fetch image from Directus
    const response = await fetch(directusUrl, {
      headers: {
        // Forward original headers if needed
        'User-Agent': request.headers.get('user-agent') || 'Next.js Image Proxy',
      },
      // Cache for 1 year (images don't change)
      next: { revalidate: 31536000 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch image from Directus: ${directusUrl}`);
      return new NextResponse('Image not found', { status: 404 });
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return image with proper caching headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Error proxying image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Support HEAD requests for social media crawlers
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    const directusUrl = queryString
      ? `${DIRECTUS_URL}/${path}?${queryString}`
      : `${DIRECTUS_URL}/${path}`;

    const response = await fetch(directusUrl, { method: 'HEAD' });

    return new NextResponse(null, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}