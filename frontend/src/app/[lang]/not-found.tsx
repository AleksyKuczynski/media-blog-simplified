// app/[lang]/not-found.tsx
import { cookies, headers } from 'next/headers';
import { getDictionary, type Lang } from '@/main/lib/dictionary';
import { DEFAULT_LANG, SUPPORTED_LANGUAGES } from '@/main/lib/constants/constants';
import { Metadata } from 'next';
import StandardError from '@/features/errors/StandardError';
import { createErrorHandler } from '@/features/errors/lib/errorUtils';

/**
 * Detect language from request context
 * Since not-found doesn't receive params, we check:
 * 1. Cookie preference
 * 2. Pathname (if available in headers)
 * 3. Fallback to DEFAULT_LANG
 */
async function detectLanguage(): Promise<Lang> {
  // Try cookie
  const cookieStore = await cookies();
  const langCookie = cookieStore.get('preferred-language')?.value;
  if (langCookie && SUPPORTED_LANGUAGES.includes(langCookie as Lang)) {
    return langCookie as Lang;
  }

  // Try pathname from headers
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  if (langMatch && SUPPORTED_LANGUAGES.includes(langMatch[1] as Lang)) {
    return langMatch[1] as Lang;
  }

  // Fallback to default
  return DEFAULT_LANG;
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await detectLanguage();
  const dictionary = getDictionary(lang);
  const errorHandler = createErrorHandler(dictionary);
  return errorHandler.generateErrorMetadata('page');
}

export default async function LanguageNotFound() {
  const lang = await detectLanguage();
  const dictionary = getDictionary(lang);
  
  return (
    <StandardError 
      dictionary={dictionary} 
      contentType="page"
    />
  );
}