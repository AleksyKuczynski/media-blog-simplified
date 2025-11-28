// app/global-error.tsx

'use client';

import { createErrorHandler } from '@/features/errors/lib/errorUtils';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { dictionary } from '@/main/lib/dictionary';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary - Catches critical application errors
 * Dictionary is always available at build time - no fallbacks needed
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const errorHandler = createErrorHandler(dictionary);

  // Log critical error for monitoring
  console.error('Global error boundary triggered:', {
    message: error.message,
    digest: error.digest,
    stack: error.stack
  });

  // Generate page title for SEO
  const pageTitle = `${errorHandler.getErrorMessage('page')} — ${dictionary.seo.site.name}`;

  return (
    <html lang={DEFAULT_LANG}>
      <head>
        <title>{pageTitle}</title>
        <meta name="description" content={errorHandler.getErrorDescription('page')} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-sf-cont p-4">
          <div className="max-w-md text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {dictionary.errors.templates.criticalError}
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              {dictionary.errors.templates.criticalDescription}
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                type="button"
              >
                {errorHandler.getRetryText()}
              </button>

              <button
                onClick={() => window.location.href = '/ru'}
                className="w-full px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                type="button"
              >
                {errorHandler.getBackToHomeText()}
              </button>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Детали ошибки (только в разработке)
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}