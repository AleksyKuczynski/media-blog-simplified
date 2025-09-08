// src/main/components/Navigation/SkipLinks.tsx
// Migrated to new dictionary structure with enhanced accessibility

'use client'

// NEW: Import new dictionary types
import { Dictionary } from '@/main/lib/dictionary/types'

interface SkipLinksProps {
  dictionary: Dictionary // NEW: Use new dictionary structure
}

export default function SkipLinks({ dictionary }: SkipLinksProps) {
  const skipLinkClasses = `
    sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
    bg-primary text-on-primary px-6 py-3 rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-primary-variant focus:ring-offset-2
    transition-all duration-200 z-[100] shadow-lg
    hover:bg-primary-variant active:scale-95
  `

  return (
    <>
      {/* Primary skip links for keyboard navigation and SEO */}
      <div className="sr-only focus-within:not-sr-only">
        <nav 
          aria-label={dictionary.navigation.accessibility.keyboardNavigationLabel} // NEW: Updated access pattern
          className="fixed top-0 left-0 right-0 z-[100] p-4"
        >
          <ul className="flex flex-wrap gap-2" role="list">
            <li>
              <a 
                href="#main-content" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {dictionary.navigation.accessibility.skipToContent} {/* NEW: Updated access pattern */}
              </a>
            </li>
            <li>
              <a 
                href="#main-navigation" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {dictionary.navigation.accessibility.skipToNavigation} {/* NEW: Updated access pattern */}
              </a>
            </li>
            <li>
              <a 
                href="#site-search" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {dictionary.navigation.accessibility.skipToSearch} {/* NEW: Updated access pattern */}
              </a>
            </li>
            <li>
              <a 
                href="#site-footer" 
                className={skipLinkClasses}
                tabIndex={0}
              >
                {dictionary.navigation.accessibility.skipToFooter} {/* NEW: Updated access pattern */}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Enhanced structured data for navigation assistance */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://event4me.eu/ru#accessibility",
            "name": dictionary.navigation.seo.navigationTitle, // NEW: Use new SEO data
            "description": dictionary.navigation.seo.navigationDescription, // NEW: Use new SEO data
            "inLanguage": "ru",
            "audience": {
              "@type": "Audience",
              "name": dictionary.navigation.seo.audience, // NEW: Use new SEO data
              "geographicArea": dictionary.navigation.seo.geographicAreas // NEW: Use new SEO data
            },
            "accessibilityFeature": [
              "structuralNavigation",
              "skipLinks", 
              "headingNavigation",
              "keyboardNavigation",
              "enhancedSEO" // NEW: Indicate enhanced SEO features
            ],
            "accessibilityAPI": ["ARIA"],
            "accessibilityControl": ["fullKeyboardControl"],
            "accessibilityHazard": "none",
            // NEW: Enhanced accessibility metadata
            "accessibilitySummary": "Полная поддержка клавиатурной навигации с быстрыми ссылками для перехода к основным разделам сайта"
          })
        }}
      />
    </>
  )
}