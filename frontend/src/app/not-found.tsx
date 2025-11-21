// app/not-found.tsx
import { getDictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import StandardError from '@/main/components/errors/StandardError';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';

export default function NotFound() {
  // Use DEFAULT_LANG (English)
  const dictionary = getDictionary(DEFAULT_LANG);
  const errorHandler = createErrorHandler(dictionary);
  const metadata = errorHandler.generateErrorMetadata('page');
  
  return (
    <html lang={DEFAULT_LANG}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <StandardError 
          dictionary={dictionary} 
          contentType="page"
        />
      </body>
    </html>
  );
}