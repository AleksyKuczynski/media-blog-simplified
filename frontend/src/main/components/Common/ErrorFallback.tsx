// src/main/components/Common/ErrorFallback.tsx
// NEW: Reusable error fallback component using dictionary

import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import Section from '@/main/components/Main/Section';

interface ErrorFallbackProps {
  dictionary: Dictionary;
  contentType?: 'article' | 'rubric' | 'author' | 'page' | 'content';
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable Error Fallback Component
 * Uses dictionary templates for consistent error messaging
 */
export default function ErrorFallback({ 
  dictionary, 
  contentType = 'page',
  showRetry = false,
  onRetry,
  className = 'py-8'
}: ErrorFallbackProps) {
  const errorTitle = processTemplate(dictionary.errors.templates.loadingError, {
    contentType: dictionary.errors.types[contentType]
  });
  
  const errorDescription = processTemplate(dictionary.errors.templates.loadingDescription, {
    contentType: dictionary.errors.types[contentType]
  });
  
  const backToHomeText = `${dictionary.common.actions.backTo} ${dictionary.navigation.labels.home}`;

  return (
    <Section className={className}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-on-sf">
          {errorTitle}
        </h1>
        <p className="text-gray-600 mb-6">
          {errorDescription}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {dictionary.errors.templates.retryAction}
            </button>
          )}
          
          <a 
            href="/ru" 
            className="px-6 py-3 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {backToHomeText}
          </a>
        </div>
      </div>
    </Section>
  );
}

// Helper function for generating metadata fallbacks
export const generateErrorMetadata = (
  dictionary: Dictionary,
  contentType: 'article' | 'rubric' | 'author' | 'page' = 'page'
): { title: string; description: string } => {
  const notFoundMeta = dictionary.metadata.notFound[contentType];
  
  return {
    title: processTemplate(dictionary.seo.templates.pageTitle, {
      title: notFoundMeta.title,
      siteName: dictionary.seo.site.name
    }),
    description: notFoundMeta.description,
  };
};

// Helper function for generating not found metadata
export const generateNotFoundMetadata = (
  dictionary: Dictionary,
  contentType: 'article' | 'rubric' | 'author' | 'page' = 'page'
): { title: string; description: string } => {
  return generateErrorMetadata(dictionary, contentType);
};