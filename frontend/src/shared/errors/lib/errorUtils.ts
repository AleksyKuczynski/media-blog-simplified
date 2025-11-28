// src/main/lib/errors/errorUtils.ts
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';

export type ContentType = 'article' | 'rubric' | 'author' | 'page' | 'content';

/**
 * Simple error utilities - no fallbacks needed
 * Dictionary is always available in SSG/SSR builds
 */
export class ErrorHandler {
  constructor(private dictionary: Dictionary) {}

  /**
   * Get error message for content type
   */
  getErrorMessage(contentType: ContentType = 'page'): string {
    const contentTypeText = this.dictionary.errors.types[contentType];
    return processTemplate(this.dictionary.errors.templates.loadingError, {
      contentType: contentTypeText
    });
  }

  /**
   * Get error description for content type
   */
  getErrorDescription(contentType: ContentType = 'page'): string {
    const contentTypeText = this.dictionary.errors.types[contentType];
    return processTemplate(this.dictionary.errors.templates.loadingDescription, {
      contentType: contentTypeText
    });
  }

  /**
   * Get retry action text
   */
  getRetryText(): string {
    return this.dictionary.errors.templates.retryAction;
  }

  /**
   * Get back to home text
   */
  getBackToHomeText(): string {
    return `${this.dictionary.common.actions.backTo} ${this.dictionary.navigation.labels.home}`;
  }

  /**
   * Generate error metadata for SEO
   */
  generateErrorMetadata(contentType: ContentType = 'page') {
    const notFoundMeta = this.dictionary.metadata.notFound[contentType];
    return {
      title: processTemplate(this.dictionary.seo.templates.pageTitle, {
        title: notFoundMeta.title,
        siteName: this.dictionary.seo.site.name
      }),
      description: notFoundMeta.description,
    };
  }
}

/**
 * Create error handler - no async needed
 */
export function createErrorHandler(dictionary: Dictionary): ErrorHandler {
  return new ErrorHandler(dictionary);
}