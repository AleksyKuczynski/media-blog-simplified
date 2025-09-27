// src/main/components/Common/ErrorFallback.tsx
// ENHANCED: Reusable error fallback component with robust dictionary handling

import { Dictionary } from '@/main/lib/dictionary/types';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import Section from '@/main/components/Main/Section';
import Link from 'next/link';

interface ErrorFallbackProps {
  dictionary: Dictionary;
  contentType?: 'article' | 'rubric' | 'author' | 'page' | 'content';
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * Safe dictionary access with fallbacks
 */
function getSafeText(
  getter: () => string,
  fallback: string
): string {
  try {
    const result = getter();
    return result || fallback;
  } catch (error) {
    console.warn('Dictionary access failed, using fallback:', error);
    return fallback;
  }
}

/**
 * Reusable Error Fallback Component
 * Uses dictionary templates for consistent error messaging with robust fallbacks
 */
export default function ErrorFallback({ 
  dictionary, 
  contentType = 'page',
  showRetry = false,
  onRetry,
  className = 'py-8'
}: ErrorFallbackProps) {
  // Safe fallback text constants
  const FALLBACK_TEXTS = {
    errorTitle: 'Ошибка загрузки',
    errorDescription: 'Произошла ошибка. Попробуйте обновить страницу.',
    retryAction: 'Попробовать снова',
    backToHome: 'Вернуться к Главная',
  };

  // Safe dictionary access with fallbacks
  const contentTypeText = getSafeText(
    () => dictionary.errors?.types?.[contentType],
    contentType === 'article' ? 'статьи' : 
    contentType === 'rubric' ? 'рубрики' :
    contentType === 'author' ? 'автора' :
    contentType === 'content' ? 'контента' : 'страницы'
  );

  const errorTitle = getSafeText(
    () => processTemplate(dictionary.errors.templates.loadingError, {
      contentType: contentTypeText
    }),
    `${FALLBACK_TEXTS.errorTitle} ${contentTypeText}`
  );
  
  const errorDescription = getSafeText(
    () => processTemplate(dictionary.errors.templates.loadingDescription, {
      contentType: contentTypeText
    }),
    FALLBACK_TEXTS.errorDescription
  );

  const retryText = getSafeText(
    () => dictionary.errors?.templates?.retryAction,
    FALLBACK_TEXTS.retryAction
  );

  const backToHomeText = getSafeText(
    () => `${dictionary.common?.actions?.backTo} ${dictionary.navigation?.labels?.home}`,
    FALLBACK_TEXTS.backToHome
  );

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
              aria-label={retryText}
            >
              {retryText}
            </button>
          )}
          
          <Link 
            href="/ru" 
            className="px-6 py-3 text-blue-600 hover:text-blue-800 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            aria-label={backToHomeText}
          >
            {backToHomeText}
          </Link>
        </div>
      </div>
    </Section>
  );
}

/**
 * Helper function for generating metadata fallbacks with safe dictionary access
 */
export const generateErrorMetadata = (
  dictionary: Dictionary,
  contentType: 'article' | 'rubric' | 'author' | 'page' = 'page'
): { title: string; description: string } => {
  try {
    const notFoundMeta = dictionary.metadata?.notFound?.[contentType];
    
    if (!notFoundMeta) {
      // Fallback metadata if dictionary structure is incomplete
      const fallbackTitles = {
        article: 'Статья не найдена',
        rubric: 'Рубрика не найдена', 
        author: 'Автор не найден',
        page: 'Страница не найдена'
      };
      
      const fallbackDescriptions = {
        article: 'Запрашиваемая статья не найдена',
        rubric: 'Запрашиваемая рубрика не найдена',
        author: 'Запрашиваемый автор не найден', 
        page: 'Запрашиваемая страница не найдена'
      };

      return {
        title: `${fallbackTitles[contentType]} — EventForMe`,
        description: fallbackDescriptions[contentType],
      };
    }

    return {
      title: processTemplate(dictionary.seo?.templates?.pageTitle || '{title} — {siteName}', {
        title: notFoundMeta.title,
        siteName: dictionary.seo?.site?.name || 'EventForMe'
      }),
      description: notFoundMeta.description,
    };
  } catch (error) {
    console.error('Error generating error metadata:', error);
    
    // Ultimate fallback
    return {
      title: 'Ошибка — EventForMe',
      description: 'Произошла ошибка при загрузке страницы.',
    };
  }
};

/**
 * Helper function for generating not found metadata
 */
export const generateNotFoundMetadata = (
  dictionary: Dictionary,
  contentType: 'article' | 'rubric' | 'author' | 'page' = 'page'
): { title: string; description: string } => {
  return generateErrorMetadata(dictionary, contentType);
};

/**
 * Validate dictionary completeness for error handling
 * Useful for debugging and monitoring
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