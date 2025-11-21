// src/app/api/preview/status/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const previewCookie = cookieStore.get('preview-mode');
  
  return NextResponse.json({
    previewMode: previewCookie?.value === 'true',
    cookie: previewCookie ? {
      value: previewCookie.value,
      // Don't expose full cookie details in production
    } : null,
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasSiteUrl: !!process.env.SITE_URL,
      hasDirectusUrl: !!process.env.DIRECTUS_URL,
      hasPreviewSecret: !!process.env.PREVIEW_SECRET,
    }
  });
}