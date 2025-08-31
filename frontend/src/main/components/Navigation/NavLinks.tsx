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

export default function NavLinks({ 
  lang, 
  translations, 
  role = 'menuitem',
  className = ''
}: NavLinksProps) {
  return (
    <>
      {NAVIGATION_LINKS.map((link, index) => {
        const linkDescription = translations[link.descriptionKey];
        
        return (
          <li 
            key={link.href} 
            className={`
              nav-link-item list-none
              ${className}
            `}
            role={role}
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <Link 
              href={`/ru${link.href}`}
              className="
                nav-link
                px-4 py-2 rounded-full font-medium
                text-on-sf-var hover:text-on-sf hover:bg-sf-hi
                data-[active=true]:bg-sf-hi data-[active=true]:text-pr-cont data-[active=true]:font-bold
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                touch-manipulation
              " 
              data-href={link.href}
              aria-label={linkDescription}
              title={linkDescription}
              itemProp="url"
              data-nav-priority={link.priority}
              data-nav-section={link.translationKey}
              data-active="false"
            >
              <span itemProp="name">
                {translations[link.translationKey]}
              </span>
              
              {/* Hidden description for screen readers */}
              <span className="sr-only">
                - {linkDescription}
              </span>
              
              {/* Schema.org metadata */}
              <meta itemProp="description" content={linkDescription} />
              <meta itemProp="position" content={`${index + 1}`} />
            </Link>
          </li>
        );
      })}
      
      {/* ✅ SIMPLIFIED: NavLinksClient only handles active states */}
      <NavLinksClient lang={lang} translations={translations} />
    </>
  );
}