// src/main/components/Navigation/NavLinks.tsx
// DRY: Uses existing helpers, no dictionary expansion

import Link from 'next/link';
import NavLinksClient from './NavLinksClient';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import { getNavigationLinksConfig } from '@/main/lib/dictionary/helpers/navigation';

// ===================================================================
// TYPES - Simple and clean
// ===================================================================

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
}

// ===================================================================
// MAIN NAVLINKS COMPONENT - DRY
// ===================================================================

/**
 * NavLinks component using existing helpers
 * NO DUPLICATION - uses getNavigationLinksConfig helper
 */
export default function NavLinks({ dictionary, lang, className }: NavLinksProps) {
  try {
    // Use existing helper function - NO DUPLICATION
    const navigationLinks = getNavigationLinksConfig(dictionary);

    return (
      <>
        {navigationLinks.map((link, index) => (
          <li 
            key={link.href}
            className={`nav-link-item list-none ${className || ''}`}
            role="menuitem"
          >
            <Link 
              href={`/ru${link.href}`}
              className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
              aria-label={link.ariaLabel}
              title={link.title}
              data-nav-section={link.key}
              data-nav-priority={link.priority}
            >
              {link.label}
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
    
    // Fallback navigation using basic dictionary properties
    return (
      <>
        <li role="menuitem">
          <Link href="/ru/articles" className="nav-link px-4 py-2">
            {dictionary.navigation.labels.articles}
          </Link>
        </li>
        <li role="menuitem">
          <Link href="/ru/rubrics" className="nav-link px-4 py-2">
            {dictionary.navigation.labels.rubrics}
          </Link>
        </li>
        <li role="menuitem">
          <Link href="/ru/authors" className="nav-link px-4 py-2">
            {dictionary.navigation.labels.authors}
          </Link>
        </li>
        
        <NavLinksClient dictionary={dictionary} lang={lang} />
      </>
    );
  }
}