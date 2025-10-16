// app/ru/not-found.tsx
import dictionary from '@/main/lib/dictionary/dictionary';
import StandardError from '@/main/components/errors/StandardError';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import { Metadata } from 'next';

export function generateMetadata(): Metadata {
  const errorHandler = createErrorHandler(dictionary);
  return errorHandler.generateErrorMetadata('page');
}

export default function RuNotFound() {
  return (
    <StandardError 
      dictionary={dictionary} 
      contentType="page"
    />
  );
}