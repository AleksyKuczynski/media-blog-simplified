// frontend/src/app/api/images/[...path]/route.ts
/**
 * Image Proxy API Route with Debugging
 * 
 * Proxies Directus images through Next.js to provide HTTPS URLs
 * Includes comprehensive logging for debugging
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now();
  
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

    console.log('=== Image Proxy Request ===');
    console.log('Path:', path);
    console.log('Query:', queryString);
    console.log('Directus URL:', directusUrl);
    console.log('Has Token:', !!DIRECTUS_API_TOKEN);
    console.log('Token (first 10 chars):', DIRECTUS_API_TOKEN?.substring(0, 10));

    // Build headers with authentication
    const headers: HeadersInit = {
      'User-Agent': 'Next.js Image Proxy',
    };
    
    // Add Directus API token
    if (DIRECTUS_API_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_API_TOKEN}`;
      console.log('Added Authorization header');
    } else {
      console.warn('⚠️ No DIRECTUS_API_TOKEN found in environment');
    }

    console.log('Request Headers:', JSON.stringify(headers, null, 2));

    // Fetch image from Directus
    const fetchStartTime = Date.now();
    const response = await fetch(directusUrl, {
      headers,
      // Don't use Next.js cache for debugging
      cache: 'no-store',
    });
    const fetchDuration = Date.now() - fetchStartTime;

    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    console.log('Fetch Duration:', fetchDuration, 'ms');

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Directus Error Response:', errorBody);
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      
      // Return detailed error for debugging
      return new NextResponse(
        JSON.stringify({
          error: 'Failed to fetch image from Directus',
          status: response.status,
          statusText: response.statusText,
          directusUrl,
          hasToken: !!DIRECTUS_API_TOKEN,
          errorBody: errorBody.substring(0, 500), // First 500 chars
        }, null, 2),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageSize = imageBuffer.byteLength;

    console.log('✅ Success!');
    console.log('Content-Type:', contentType);
    console.log('Image Size:', imageSize, 'bytes');
    console.log('Total Duration:', Date.now() - startTime, 'ms');
    console.log('========================\n');

    // Return image with proper caching headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageSize.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000',
        'X-Image-Size': imageSize.toString(),
        'X-Proxy-Duration': `${Date.now() - startTime}ms`,
      },
    });

  } catch (error) {
    console.error('💥 Exception in image proxy:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      }, null, 2),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
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

    console.log('=== Image Proxy HEAD Request ===');
    console.log('URL:', directusUrl);

    // Build headers with authentication
    const headers: HeadersInit = {};
    if (DIRECTUS_API_TOKEN) {
      headers['Authorization'] = `Bearer ${DIRECTUS_API_TOKEN}`;
    }

    const response = await fetch(directusUrl, { 
      method: 'HEAD',
      headers,
    });

    console.log('HEAD Response Status:', response.status);
    console.log('================================\n');

    return new NextResponse(null, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error in HEAD request:', error);
    return new NextResponse(null, { status: 500 });
  }
}