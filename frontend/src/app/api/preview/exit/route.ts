// frontend/src/app/api/preview/exit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete('preview-mode');

  const redirect = request.nextUrl.searchParams.get('redirect') || '/';
  return NextResponse.redirect(new URL(redirect, request.url));
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('preview-mode');
  return NextResponse.json({ success: true });
}