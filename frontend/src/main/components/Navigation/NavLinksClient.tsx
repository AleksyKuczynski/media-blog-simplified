// src/main/components/Navigation/NavLinksClient.tsx - Clean Active State Management Only
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';

interface NavLinksClientProps {
  lang: Lang;
  translations: NavigationTranslations;
}

export default function NavLinksClient({ lang }: NavLinksClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Find all navigation links and manage their active states
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach((link) => {
      const href = link.getAttribute('data-href');
      if (!href) return;

      const linkElement = link as HTMLElement;
      const spanElement = linkElement.querySelector('span[itemProp="name"]') as HTMLElement;
      
      // Enhanced active state detection
      const isActive = pathname.startsWith(`/ru${href}`);
      const isExactMatch = pathname === `/ru${href}` || (href === '/' && pathname === '/ru');
      const isCurrentPage = isActive || isExactMatch;
      
      if (isCurrentPage) {
        // Apply active state
        linkElement.setAttribute('aria-current', 'page');
        linkElement.setAttribute('data-active', 'true');
        
        // Add structured data indicator
        if (spanElement) {
          spanElement.setAttribute('data-current-page', 'true');
        }
        
      } else {
        // Remove active state
        linkElement.removeAttribute('aria-current');
        linkElement.setAttribute('data-active', 'false');
        
        // Remove structured data indicator
        if (spanElement) {
          spanElement.removeAttribute('data-current-page');
        }
      }
    });
    
  }, [pathname, lang]);

  return null; // This component only manages active states, renders nothing
}