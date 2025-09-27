// src/main/components/Navigation/SkipLinks.tsx
// FIXED: Now uses actual helper functions with proper accessibility and SEO

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
 * SkipLinks component - Enhanced accessibility navigation for keyboard users
 * Optimized for Russian market SEO (Google + Yandex) with semantic markup
 */
export default function SkipLinks({ dictionary }: SkipLinksProps) {
  try {
    // FIXED: Now uses the correct helper functions
    const skipLinks = getSkipLinksData(dictionary);
    const accessibility = getSkipLinksAccessibility(dictionary);

    // Enhanced skip link styling with improved focus management
    const skipLinkClasses = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
      focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
      transition-all duration-200 z-[100] shadow-lg
      hover:bg-primary-variant active:scale-95
      text-sm tracking-wide
    `;

    return (
      <div 
        className="sr-only focus-within:not-sr-only"
        role="region"
        aria-label={accessibility.skipLinksDescription}
      >
        <nav 
          aria-label={accessibility.keyboardNavigationLabel}
          className="fixed top-0 left-0 right-0 z-[100] p-4"
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a 
                href={skipLinks.skipToContent.href}
                className={skipLinkClasses}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToContent.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToNavigation.href}
                className={skipLinkClasses}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToNavigation.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToSearch.href}
                className={skipLinkClasses}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToSearch.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToFooter.href}
                className={skipLinkClasses}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToFooter.label}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
    
  } catch (error) {
    console.error('SkipLinks: Error rendering skip links', error);
    
    // Enhanced fallback skip links with semantic markup
    const fallbackSkipLinkClasses = `
      sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
      bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
      focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
      transition-all duration-200 z-[100] shadow-lg
      text-sm tracking-wide
    `;

    return (
      <div 
        className="sr-only focus-within:not-sr-only"
        role="region"
        aria-label={dictionary.footer.accessibility.footerNavigation}
      >
        <nav 
          className="fixed top-0 left-0 right-0 z-[100] p-4"
          aria-label={dictionary.footer.quickLinks.title}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a 
                href="#main-content" 
                className={fallbackSkipLinkClasses}
                itemProp="url"
              >
                <span itemProp="name">
                  {dictionary.navigation.accessibility.skipToContent}
                </span>
              </a>
            </li>
            <li>
              <a 
                href="#main-navigation" 
                className={fallbackSkipLinkClasses}
                itemProp="url"
              >
                <span itemProp="name">
                  {dictionary.navigation.accessibility.skipToNavigation}
                </span>
              </a>
            </li>
            <li>
              <a 
                href="#site-search" 
                className={fallbackSkipLinkClasses}
                itemProp="url"
              >
                <span itemProp="name">
                  {dictionary.search.accessibility.searchLabel}
                </span>
              </a>
            </li>
            <li>
              <a 
                href="#site-footer" 
                className={fallbackSkipLinkClasses}
                itemProp="url"
              >
                <span itemProp="name">
                  {dictionary.footer.accessibility.skipToFooter}
                  </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}