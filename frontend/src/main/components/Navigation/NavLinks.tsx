// src/main/components/Navigation/NavLinks.tsx - Simplified with Unified Styling
import Link from 'next/link';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import NavLinksClient from './NavLinksClient';

interface NavLinksProps {
  lang: Lang;
  translations: NavigationTranslations;
  role?: string;
  className?: string; // Optional additional classes for container
}

type NavigationLink = {
  href: string;
  translationKey: keyof NavigationTranslations;
  description: string; // SEO description
  priority: number; // For Schema.org ordering
};

const NAVIGATION_LINKS: NavigationLink[] = [
  { 
    href: '/articles', 
    translationKey: 'articles',
    description: 'Просмотреть все статьи и публикации на сайте EventForMe',
    priority: 1
  },
  { 
    href: '/rubrics', 
    translationKey: 'rubrics',
    description: 'Изучить тематические рубрики и разделы контента',
    priority: 2
  },
  { 
    href: '/authors', 
    translationKey: 'authors',
    description: 'Познакомиться с нашими авторами и экспертами',
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
      {NAVIGATION_LINKS.map((link, index) => (
        <li 
          key={link.href} 
          className={`list-none ${className}`}
          role={role}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <Link 
            href={`/ru${link.href}`}
            className="nav-link" // ✅ Only the essential class - NavLinksClient handles all styling
            data-href={link.href}
            aria-label={link.description}
            title={link.description}
            itemProp="url"
            // Enhanced SEO attributes
            data-nav-priority={link.priority}
            data-nav-section={link.translationKey}
          >
            <span itemProp="name">
              {translations[link.translationKey]}
            </span>
            
            {/* Hidden description for screen readers */}
            <span className="sr-only">
              - {link.description}
            </span>
            
            {/* Schema.org metadata */}
            <meta itemProp="description" content={link.description} />
            <meta itemProp="position" content={`${index + 1}`} />
          </Link>
        </li>
      ))}
      
      {/* ✅ Always include NavLinksClient - it's now the single source of truth */}
      <NavLinksClient lang={lang} translations={translations} />
    </>
  );
}