// src/shared/errors/PageError.tsx

import Link from 'next/link';
import { Dictionary } from '@/config/i18n';
import { ContentType, createErrorHandler } from './lib/errorUtils';

interface PageErrorProps {
  dictionary: Dictionary;
  contentType?: ContentType;
  backHref?: string;
}

/**
 * Reusable error component for collection pages
 * Used when entire page fails to load
 */
export default function PageError({
  dictionary,
  contentType = 'page',
  backHref = '/ru'
}: PageErrorProps) {
  const errorHandler = createErrorHandler(dictionary);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      {/* Error Icon */}
      <div className="w-16 h-16 mx-auto mb-6 bg-sf-hi rounded-full flex items-center justify-center">
        <svg 
          className="w-8 h-8 text-on-sf-var" 
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

      {/* Error Message */}
      <h1 className="text-2xl font-bold mb-4 text-on-sf">
        {errorHandler.getErrorMessage(contentType)}
      </h1>
      
      <p className="text-on-sf-var mb-8 max-w-md mx-auto">
        {errorHandler.getErrorDescription(contentType)}
      </p>

      {/* Back Link */}
      <Link 
        href={backHref}
        className="inline-flex items-center px-6 py-3 text-on-pr bg-pr-cont hover:bg-pr-fix rounded-lg transition-colors"
      >
        {errorHandler.getBackToHomeText()}
      </Link>
    </div>
  );
}