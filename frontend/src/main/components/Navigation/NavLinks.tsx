// src/main/components/Navigation/NavLinks.tsx
// FIXED: Now uses actual helper functions with proper imports and error handling

import Link from 'next/link';
import NavLinksClient from './NavLinksClient';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { getNavigationLinksConfig } from '@/main/lib/dictionary/helpers/navigation';

// ===================================================================
// TYPES - Clean and focused
// ===================================================================

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
}

// ===================================================================
// MAIN NAVLINKS COMPONENT - FIXED AND ENHANCED
// ===================================================================

/**
 * NavLinks component - Enhanced with proper helper usage and SEO optimization
 * Uses semantic HTML markup for accessibility and SEO (Google + Yandex)
 */
export default function NavLinks({ dictionary, lang, className }: NavLinksProps) {
  try {
    // FIXED: Now uses the correct helper function
    const navigationLinks = getNavigationLinksConfig(dictionary);

    return (
      <>
        {navigationLinks.map((link) => (
          <li 
            key={link.key}
            className={`nav-link-item list-none ${className || ''}`}
            role="menuitem"
          >
            <Link 
              href={`/ru${link.href}`}
              className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
              aria-label={link.ariaLabel}
              title={link.title}
              data-href={link.href}
              data-nav-section={link.key}
              data-nav-priority={link.priority}
              // Enhanced SEO attributes for Russian market
              itemProp="url"
              itemScope
              itemType="https://schema.org/SiteNavigationElement"
            >
              <span 
                itemProp="name"
                className="font-medium"
              >
                {link.label}
              </span>
              {/* Hidden description for screen readers and SEO */}
              <span className="sr-only" itemProp="description">
                {link.description}
              </span>
            </Link>
          </li>
        ))}
        
        {/* Client-side active state management */}
        <NavLinksClient 
          dictionary={dictionary} 
          lang={lang}
        />
      </>
    );
    
  } catch (error) {
    console.error('NavLinks: Error rendering navigation links', error);
    
    // Enhanced fallback navigation with semantic markup
    return (
      <>
        <li role="menuitem">
          <Link 
            href="/ru/articles" 
            className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200" 
            data-href="/articles"
            data-nav-section="articles"
            itemProp="url"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <span itemProp="name">{dictionary.navigation.labels.articles}</span>
            <span className="sr-only" itemProp="description">
              {dictionary.navigation.descriptions.articles}
            </span>
          </Link>
        </li>
        <li role="menuitem">
          <Link 
            href="/ru/rubrics" 
            className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200" 
            data-href="/rubrics"
            data-nav-section="rubrics"
            itemProp="url"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <span itemProp="name">{dictionary.navigation.labels.rubrics}</span>
            <span className="sr-only" itemProp="description">
              {dictionary.navigation.descriptions.rubrics}
            </span>
          </Link>
        </li>
        <li role="menuitem">
          <Link 
            href="/ru/authors" 
            className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200" 
            data-href="/authors"
            data-nav-section="authors"
            itemProp="url"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <span itemProp="name">{dictionary.navigation.labels.authors}</span>
            <span className="sr-only" itemProp="description">
              {dictionary.navigation.descriptions.authors}
            </span>
          </Link>
        </li>
        
        <NavLinksClient dictionary={dictionary} lang={lang} />
      </>
    );
  }
}