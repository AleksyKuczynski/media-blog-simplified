// src/main/components/Navigation/NavLinksClient.tsx - SIMPLIFIED
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
    // Simple active state detection with direct rounded theme classes
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach((link) => {
      const href = link.getAttribute('data-href');
      if (!href) return;

      const linkElement = link as HTMLElement;
      
      // Check if current page matches this link
      const isActive = pathname.startsWith(`/ru${href}`);
      
      if (isActive) {
        // Active state: rounded theme styling
        linkElement.className = linkElement.className.replace(
          /text-gray-700|text-gray-300|hover:text-blue-600|dark:hover:text-blue-400/g, ''
        ).trim();
        linkElement.className += ' text-pr-cont bg-sf-hi font-bold rounded-full';
      } else {
        // Normal state: reset to base styling  
        linkElement.className = linkElement.className.replace(
          /text-pr-cont|bg-sf-hi|font-bold/g, ''
        ).trim();
        if (!linkElement.className.includes('text-gray-700')) {
          linkElement.className += ' text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400';
        }
      }
    });
  }, [pathname, lang]);

  return null;
}