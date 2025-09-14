// src/main/components/Navigation/SkipLinks.tsx
// DRY: Uses existing helpers, no dictionary expansion

'use client';

import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  getSkipLinksData, 
  getSkipLinksAccessibility 
} from '@/main/lib/dictionary/helpers/navigation';

interface SkipLinksProps {
  dictionary: Dictionary;
}

/**
 * SkipLinks component using existing helpers
 * NO DUPLICATION - uses existing dictionary properties + static fallbacks
 */
export default function SkipLinks({ dictionary }: SkipLinksProps) {
  try {
    // Use existing helper functions - NO DUPLICATION
    const skipLinks = getSkipLinksData(dictionary);
    const accessibility = getSkipLinksAccessibility(dictionary);

    const skipLinkClasses = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
      focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
      transition-all duration-200 z-[100] shadow-lg
      hover:bg-primary-variant active:scale-95
    `;

    return (
      <div className="sr-only focus-within:not-sr-only">
        <nav 
          aria-label={accessibility.keyboardNavigationLabel}
          className="fixed top-0 left-0 right-0 z-[100] p-4"
        >
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a 
                href={skipLinks.skipToContent.href}
                className={skipLinkClasses}
                tabIndex={0}
              >
                {skipLinks.skipToContent.label}
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToNavigation.href}
                className={skipLinkClasses}
                tabIndex={0}
              >
                {skipLinks.skipToNavigation.label}
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToSearch.href}
                className={skipLinkClasses}
                tabIndex={0}
              >
                {skipLinks.skipToSearch.label}
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToFooter.href}
                className={skipLinkClasses}
                tabIndex={0}
              >
                {skipLinks.skipToFooter.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
    
  } catch (error) {
    console.error('SkipLinks: Error rendering skip links', error);
    
    // Fallback skip links using basic dictionary properties
    const skipLinkClasses = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
      focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
      transition-all duration-200 z-[100] shadow-lg
    `;

    return (
      <div className="sr-only focus-within:not-sr-only">
        <nav className="fixed top-0 left-0 right-0 z-[100] p-4">
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a href="#main-content" className={skipLinkClasses}>
                {dictionary.navigation.accessibility.skipToContent}
              </a>
            </li>
            <li>
              <a href="#main-navigation" className={skipLinkClasses}>
                {dictionary.navigation.accessibility.skipToNavigation}
              </a>
            </li>
            <li>
              <a href="#site-search" className={skipLinkClasses}>
                Перейти к поиску
              </a>
            </li>
            <li>
              <a href="#site-footer" className={skipLinkClasses}>
                Перейти к подвалу
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}