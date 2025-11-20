// frontend/src/app/api/preview/exit/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('preview-mode');
  return NextResponse.json({ success: true });
}