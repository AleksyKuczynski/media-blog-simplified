// src/app/api/health/route.ts

import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  checks: {
    nextjs: boolean;
    directus: boolean;
  };
}

export async function GET() {
  const startTime = Date.now();
  
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      nextjs: true,
      directus: false,
    },
  };

  // Check Directus connectivity
  try {
    if (DIRECTUS_URL) {
      const directusResponse = await fetch(`${DIRECTUS_URL}/server/ping`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      
      healthStatus.checks.directus = directusResponse.ok;
    }
  } catch (error) {
    console.error('Health check: Directus ping failed', error);
    healthStatus.checks.directus = false;
  }

  // Determine overall status
  if (!healthStatus.checks.directus) {
    healthStatus.status = 'degraded';
  }

  const responseTime = Date.now() - startTime;
  
  return NextResponse.json(
    {
      ...healthStatus,
      responseTime: `${responseTime}ms`,
    },
    {
      status: healthStatus.status === 'unhealthy' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}