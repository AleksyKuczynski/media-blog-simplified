// frontend/src/main/lib/utils/previewMode.ts

import { cookies } from 'next/headers';

const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

/**
 * Validate preview request and set preview cookie
 * Call this in middleware or page component
 */
export async function validatePreviewMode(
  previewParam: string | null,
  secretParam: string | null
): Promise<boolean> {
  if (!previewParam || !secretParam) {
    return false;
  }

  if (previewParam === 'true' && secretParam === PREVIEW_SECRET) {
    const cookieStore = await cookies();
    cookieStore.set('preview-mode', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    });
    return true;
  }

  return false;
}

/**
 * Check if currently in preview mode
 */
export async function isPreviewMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('preview-mode')?.value === 'true';
}

/**
 * Clear preview mode
 */
export async function clearPreviewMode(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('preview-mode');
}