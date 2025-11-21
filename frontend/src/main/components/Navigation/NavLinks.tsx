// src/main/components/Navigation/NavLinks.tsx
// ✅ FIXED: Uses correct function getNavigationItems with lang parameter

import Link from 'next/link';
import NavLinksClient from './NavLinksClient';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import { getNavigationItems } from '@/main/lib/dictionary/helpers/navigation';

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
}

/**
 * NavLinks component - Server-side navigation links
 * Uses getNavigationItems helper for consistent structure
 */
export default function NavLinks({ dictionary, lang, className }: NavLinksProps) {
  try {
    // ✅ FIXED: Use correct function name and pass both dictionary and lang
    const navigationLinks = getNavigationItems(dictionary, lang);

    return (
      <>
        {navigationLinks.map((link) => (
          <li 
            key={link.key}
            className={`nav-link-item list-none ${className || ''}`}
            role="menuitem"
          >
            <Link 
              href={link.href} // ✅ Already includes lang prefix from helper
              className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
              aria-label={`${link.label} - ${link.description}`}
              title={link.description}
              data-href={link.path}
              data-nav-section={link.key}
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
        
        <NavLinksClient 
          dictionary={dictionary} 
          lang={lang}
        />
      </>
    );
    
  } catch (error) {
    console.error('NavLinks: Error rendering navigation links', error);
    
    // Fallback navigation using dictionary directly
    return (
      <>
        <li role="menuitem" className={className}>
          <Link 
            href={`/${lang}/articles`}
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
        <li role="menuitem" className={className}>
          <Link 
            href={`/${lang}/rubrics`}
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
        <li role="menuitem" className={className}>
          <Link 
            href={`/${lang}/authors`}
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