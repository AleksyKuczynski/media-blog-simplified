// src/main/components/Navigation/SkipLinks.tsx - Enhanced Skip Links with Dictionary Translations
'use client'

import { NavigationTranslations, SearchTranslations } from '@/main/lib/dictionaries/dictionariesTypes';

interface SkipLinksProps {
  translations: {
    navigation: NavigationTranslations;
    search: SearchTranslations;
  };
}

export default function SkipLinks({ translations }: SkipLinksProps) {
  const skipLinkClasses = `
    sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
    bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
    transition-all duration-200 z-[100] shadow-lg
    hover:bg-primary-variant active:scale-95
  `;

  return (
    <>
      {/* Primary skip links for keyboard navigation and SEO */}
      <div className="sr-only focus-within:not-sr-only">
        <nav 
          aria-label={translations.navigation.keyboardNavigationLabel}
          className="fixed top-0 left-0 right-0 z-[100] p-4"
        >
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a 
                href="#main-content" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {translations.navigation.skipToContent}
              </a>
            </li>
            <li>
              <a 
                href="#main-navigation" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {translations.navigation.skipToNavigation}
              </a>
            </li>
            <li>
              <a 
                href="#site-search" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {translations.navigation.skipToSearch}
              </a>
            </li>
            <li>
              <a 
                href="#site-footer" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {translations.navigation.skipToFooter}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Structured data for navigation assistance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "accessibilityFeature": [
              "structuralNavigation",
              "skipLinks",
              "headingNavigation",
              "keyboardNavigation"
            ],
            "accessibilityAPI": ["ARIA"],
            "accessibilityControl": ["fullKeyboardControl"],
            "accessibilityHazard": "none"
          })
        }}
      />
    </>
  );
}