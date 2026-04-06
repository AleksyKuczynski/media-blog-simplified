// app/[lang]/not-found.tsx
import { getDictionary } from '@/config/i18n';
import { DEFAULT_LANG } from '@/config/constants/constants';
import { Metadata } from 'next';
import StandardError from '@/shared/errors/StandardError';
import { createErrorHandler } from '@/shared/errors/lib/errorUtils';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(DEFAULT_LANG);
  const errorHandler = createErrorHandler(dictionary);
  return errorHandler.generateErrorMetadata('page');
}

export default function LanguageNotFound() {
  const dictionary = getDictionary(DEFAULT_LANG);

  return (
    <StandardError 
      dictionary={dictionary} 
      contentType="page"
    />
  );
}