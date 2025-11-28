// app/error.tsx
'use client';

import { useEffect } from 'react';
import { getDictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { createErrorHandler } from '@/main/lib/errors/errorUtils';
import Section from '@/features/layout/Section';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: ErrorProps) {
  const dictionary = getDictionary(DEFAULT_LANG);
  const errorHandler = createErrorHandler(dictionary);

  useEffect(() => {
    console.error('Route error boundary triggered:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString()
    });
  }, [error]);

  return (
    <Section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-on-sf mb-4">
            {errorHandler.getErrorMessage('page')}
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {errorHandler.getErrorDescription('page')}
          </p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              {errorHandler.getRetryText()}
            </button>

            <Link
              href={`/${DEFAULT_LANG}`}
              className="block w-full px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {errorHandler.getBackToHomeText()}
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}