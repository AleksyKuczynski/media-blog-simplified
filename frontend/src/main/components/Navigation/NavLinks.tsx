// src/main/components/Navigation/NavLinks.tsx - Using Dictionary for All Text
import Link from 'next/link';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import NavLinksClient from './NavLinksClient';

interface NavLinksProps {
  lang: Lang;
  translations: NavigationTranslations;
  role?: string;
  className?: string;
}

type NavigationLink = {
  href: string;
  translationKey: keyof NavigationTranslations;
  descriptionKey: keyof NavigationTranslations; // ✅ NEW: Use dictionary for descriptions
  priority: number;
};

// ✅ SIMPLIFIED: Clean navigation links configuration using dictionary keys
const NAVIGATION_LINKS: NavigationLink[] = [
  { 
    href: '/articles', 
    translationKey: 'articles',
    descriptionKey: 'articlesDescription', // ✅ NEW: From dictionary
    priority: 1
  },
  { 
    href: '/rubrics', 
    translationKey: 'rubrics',
    descriptionKey: 'rubricsDescription', // ✅ NEW: From dictionary
    priority: 2
  },
  { 
    href: '/authors', 
    translationKey: 'authors',
    descriptionKey: 'authorsDescription', // ✅ NEW: From dictionary
    priority: 3
  },
];

export default function NavLinks({ lang, translations }: NavLinksProps) {
  return (
    <>
      {NAVIGATION_LINKS.map((link, index) => {
        const linkDescription = translations[link.descriptionKey];
        
        return (
          <li 
            key={link.href} 
            className="nav-link-item list-none"
            role="menuitem"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <Link 
              href={`/ru${link.href}`}
              className="nav-link px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi"
              data-href={link.href}
              aria-label={linkDescription}
              title={linkDescription}
              itemProp="url"
              // ✅ NEW: Enhanced SEO attributes
              data-nav-priority={link.priority}
              data-nav-section={link.translationKey}
            >
              <span itemProp="name">{translations[link.translationKey]}</span>
              
              {/* ✅ ENHANCED: Better structured description */}
              <span className="sr-only" aria-describedby={`nav-desc-${index}`}>
                - {linkDescription}
              </span>
              
              {/* ✅ NEW: Enhanced schema metadata */}
              <meta itemProp="description" content={linkDescription} />
              <meta itemProp="position" content={`${index + 1}`} />
              <meta itemProp="inLanguage" content="ru" />
            </Link>
            
            {/* ✅ NEW: Hidden detailed description for screen readers */}
            <span 
              id={`nav-desc-${index}`}
              className="sr-only"
              role="tooltip"
            >
              {linkDescription}
            </span>
          </li>
        );
      })}
      
      <NavLinksClient lang={lang} translations={translations} />
    </>
  );
}