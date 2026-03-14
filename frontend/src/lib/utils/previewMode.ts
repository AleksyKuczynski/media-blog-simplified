// frontend/src/lib/utils/previewMode.ts

import { cookies } from 'next/headers';

export async function isPreviewMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('preview-mode')?.value === 'true';
}