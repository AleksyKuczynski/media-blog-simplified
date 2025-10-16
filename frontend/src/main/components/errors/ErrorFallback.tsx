import { Dictionary } from '@/main/lib/dictionary/types';
import StandardError from '@/main/components/errors/StandardError';
import { ContentType } from '@/main/lib/errors/errorUtils';

interface ErrorFallbackProps {
  dictionary: Dictionary;
  contentType?: ContentType;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * DEPRECATED: Use StandardError directly instead
 * This component is kept for backward compatibility
 * 
 * ErrorFallback now delegates to StandardError to ensure consistency
 * and eliminate hardcoded fallback text
 */
export default function ErrorFallback(props: ErrorFallbackProps) {
  // Simply delegate to StandardError - no more hardcoded fallbacks
  return <StandardError {...props} />;
}

/**
 * @deprecated Use createErrorHandler(dictionary).generateErrorMetadata() instead
 */
export const generateErrorMetadata = (
  dictionary: Dictionary,
  contentType: ContentType = 'page'
): { title: string; description: string } => {
  const { createErrorHandler } = require('@/main/lib/errors/errorUtils');
  const errorHandler = createErrorHandler(dictionary);
  return errorHandler.generateErrorMetadata(contentType);
};

/**
 * @deprecated Use createErrorHandler(dictionary).generateErrorMetadata() instead
 */
export const generateNotFoundMetadata = (
  dictionary: Dictionary,
  contentType: ContentType = 'page'
): { title: string; description: string } => {
  return generateErrorMetadata(dictionary, contentType);
};

/**
 * @deprecated Dictionary validation should be done at build time
 */
export const validateErrorDictionary = (dictionary: Dictionary): {
  isValid: boolean;
  missingFields: string[];
} => {
  const missingFields: string[] = [];
  
  const requiredPaths = [
    'errors.templates.loadingError',
    'errors.templates.loadingDescription', 
    'errors.templates.retryAction',
    'errors.types.article',
    'errors.types.rubric',
    'errors.types.author',
    'errors.types.page',
    'errors.types.content',
    'common.actions.backTo',
    'navigation.labels.home',
    'metadata.notFound.article.title',
    'metadata.notFound.article.description',
  ];

  for (const path of requiredPaths) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], dictionary as any);
    if (!value) {
      missingFields.push(path);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};