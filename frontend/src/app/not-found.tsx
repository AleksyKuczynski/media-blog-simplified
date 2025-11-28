// app/not-found.tsx
import { getDictionary } from '@/config/i18n';
import { DEFAULT_LANG } from '@/config/constants/constants';
import StandardError from '@/shared/errors/StandardError';
import { createErrorHandler } from '@/shared/errors/lib/errorUtils';

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