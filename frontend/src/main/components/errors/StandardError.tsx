// src/components/errors/StandardError.tsx
import React from 'react';
import Link from 'next/link';
import Section from '@/features/layout/Section';
import { Dictionary } from '@/main/lib/dictionary';
import { createErrorHandler, ContentType } from '@/main/lib/errors/errorUtils';

interface StandardErrorProps {
  dictionary: Dictionary;
  contentType?: ContentType;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * Simple error component - dictionary always available
 */
export default function StandardError({
  dictionary,
  contentType = 'page',
  showRetry = false,
  onRetry,
  className = 'py-8'
}: StandardErrorProps) {
  const errorHandler = createErrorHandler(dictionary);

  return (
    <Section className={className}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-on-sf">
          {errorHandler.getErrorMessage(contentType)}
        </h1>
        <p className="text-gray-600 mb-6">
          {errorHandler.getErrorDescription(contentType)}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {errorHandler.getRetryText()}
            </button>
          )}
          
          <Link 
            href="/ru" 
            className="px-6 py-3 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {errorHandler.getBackToHomeText()}
          </Link>
        </div>
      </div>
    </Section>
  );
}