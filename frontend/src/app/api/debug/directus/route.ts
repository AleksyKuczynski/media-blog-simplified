// frontend/src/app/api/debug/directus/route.ts
/**
 * Debug Endpoint - Test Directus Configuration
 * 
 * Tests different Directus endpoints to diagnose authentication issues
 * Access: https://event4me.vercel.app/api/debug/directus
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasDirectusUrl: !!DIRECTUS_URL,
      hasToken: !!DIRECTUS_API_TOKEN,
      directusUrl: DIRECTUS_URL,
      tokenPreview: DIRECTUS_API_TOKEN?.substring(0, 10) + '...',
    },
    tests: [],
  };

  // Test 1: /server/ping (no auth needed)
  try {
    const pingUrl = `${DIRECTUS_URL}/server/ping`;
    const pingResponse = await fetch(pingUrl);
    results.tests.push({
      name: 'Server Ping',
      url: pingUrl,
      status: pingResponse.status,
      ok: pingResponse.ok,
      body: await pingResponse.text(),
    });
  } catch (error) {
    results.tests.push({
      name: 'Server Ping',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 2: /files endpoint (metadata - check if needs auth)
  try {
    const filesUrl = `${DIRECTUS_URL}/files?limit=1`;
    const filesResponse = await fetch(filesUrl);
    results.tests.push({
      name: 'Files Endpoint (no auth)',
      url: filesUrl,
      status: filesResponse.status,
      ok: filesResponse.ok,
      body: filesResponse.ok ? await filesResponse.json() : await filesResponse.text(),
    });
  } catch (error) {
    results.tests.push({
      name: 'Files Endpoint (no auth)',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 3: /files endpoint with auth
  try {
    const filesUrl = `${DIRECTUS_URL}/files?limit=1`;
    const filesResponse = await fetch(filesUrl, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
    });
    results.tests.push({
      name: 'Files Endpoint (with auth)',
      url: filesUrl,
      status: filesResponse.status,
      ok: filesResponse.ok,
      body: filesResponse.ok ? await filesResponse.json() : await filesResponse.text(),
    });
  } catch (error) {
    results.tests.push({
      name: 'Files Endpoint (with auth)',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 4: Get a real asset ID from files
  let testAssetId = null;
  try {
    const filesUrl = `${DIRECTUS_URL}/files?limit=1&fields=id`;
    const filesResponse = await fetch(filesUrl, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
      },
    });
    if (filesResponse.ok) {
      const data = await filesResponse.json();
      if (data.data && data.data.length > 0) {
        testAssetId = data.data[0].id;
        results.testAssetId = testAssetId;
      }
    }
  } catch (error) {
    results.tests.push({
      name: 'Get Test Asset ID',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Test 5: /assets endpoint without auth (if we have an asset ID)
  if (testAssetId) {
    try {
      const assetUrl = `${DIRECTUS_URL}/assets/${testAssetId}?width=100&height=100`;
      const assetResponse = await fetch(assetUrl);
      results.tests.push({
        name: 'Assets Endpoint (no auth)',
        url: assetUrl,
        status: assetResponse.status,
        ok: assetResponse.ok,
        contentType: assetResponse.headers.get('content-type'),
        contentLength: assetResponse.headers.get('content-length'),
      });
    } catch (error) {
      results.tests.push({
        name: 'Assets Endpoint (no auth)',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test 6: /assets endpoint with auth
    try {
      const assetUrl = `${DIRECTUS_URL}/assets/${testAssetId}?width=100&height=100`;
      const assetResponse = await fetch(assetUrl, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
        },
      });
      results.tests.push({
        name: 'Assets Endpoint (with auth)',
        url: assetUrl,
        status: assetResponse.status,
        ok: assetResponse.ok,
        contentType: assetResponse.headers.get('content-type'),
        contentLength: assetResponse.headers.get('content-length'),
      });
    } catch (error) {
      results.tests.push({
        name: 'Assets Endpoint (with auth)',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test 7: /assets with transformation params and auth
    try {
      const assetUrl = `${DIRECTUS_URL}/assets/${testAssetId}?width=1200&height=630&fit=cover&quality=85`;
      const assetResponse = await fetch(assetUrl, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
        },
      });
      results.tests.push({
        name: 'Assets Endpoint (with transformations and auth)',
        url: assetUrl,
        status: assetResponse.status,
        ok: assetResponse.ok,
        contentType: assetResponse.headers.get('content-type'),
        contentLength: assetResponse.headers.get('content-length'),
      });
    } catch (error) {
      results.tests.push({
        name: 'Assets Endpoint (with transformations and auth)',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Summary
  const successCount = results.tests.filter((t: any) => t.ok).length;
  const totalTests = results.tests.length;
  results.summary = {
    total: totalTests,
    successful: successCount,
    failed: totalTests - successCount,
  };

  return NextResponse.json(results, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}