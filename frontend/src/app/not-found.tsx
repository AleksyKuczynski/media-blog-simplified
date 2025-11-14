// app/not-found.tsx
import { dictionary } from '@/main/lib/dictionary';
import StandardError from '@/main/components/errors/StandardError';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';

export default function NotFound() {
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