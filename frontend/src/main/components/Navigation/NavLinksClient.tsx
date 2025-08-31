// src/main/components/Navigation/NavLinksClient.tsx - Enhanced SEO-Friendly Client Logic (No Theme Toggle)
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
    // Enhanced active state detection with SEO-friendly approach
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach((link) => {
      const href = link.getAttribute('data-href');
      const navSection = link.getAttribute('data-nav-section');
      if (!href || !navSection) return;

      const linkElement = link as HTMLElement;
      const spanElement = linkElement.querySelector('span[itemProp="name"]') as HTMLElement;
      
      // Enhanced active state detection
      const isActive = pathname.startsWith(`/ru${href}`);
      const isExactMatch = pathname === `/ru${href}` || (href === '/' && pathname === '/ru');
      
      if (isActive || isExactMatch) {
        // Active state: Enhanced styling with accessibility
        linkElement.classList.add('bg-sf-hi', 'text-pr-cont', 'font-bold');
        linkElement.classList.remove('text-on-sf-var', 'hover:text-on-sf');
        
        // Update ARIA attributes for accessibility and SEO
        linkElement.setAttribute('aria-current', 'page');
        linkElement.setAttribute('data-active', 'true');
        
        // Add structured data indicator
        if (spanElement) {
          spanElement.setAttribute('data-current-page', 'true');
        }
        
      } else {
        // Normal state: Clean styling
        linkElement.classList.remove('bg-sf-hi', 'text-pr-cont', 'font-bold');
        linkElement.classList.add('text-on-sf-var', 'hover:text-on-sf');
        
        // Remove active ARIA attributes
        linkElement.removeAttribute('aria-current');
        linkElement.setAttribute('data-active', 'false');
        
        // Remove structured data indicator
        if (spanElement) {
          spanElement.removeAttribute('data-current-page');
        }
      }
    });
    
  }, [pathname, lang]);

  // Update page title in document for SEO
  useEffect(() => {
    // This helps with navigation context for screen readers and SEO
    const updatePageContext = () => {
      const currentSection = pathname.split('/')[2]; // Extract section from /ru/section/...
      let sectionName = '';
      
      switch (currentSection) {
        case 'articles':
          sectionName = 'Статьи';
          break;
        case 'rubrics':
          sectionName = 'Рубрики';
          break;
        case 'authors':
          sectionName = 'Авторы';
          break;
        case 'search':
          sectionName = 'Поиск';
          break;
        default:
          sectionName = 'Главная';
      }
      
      // Update meta description for current navigation context
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && sectionName !== 'Главная') {
        const baseDescription = metaDescription.getAttribute('content') || '';
        if (!baseDescription.includes(sectionName)) {
          // Add section context to meta description for better SEO
          metaDescription.setAttribute('content', `${baseDescription} - ${sectionName}`);
        }
      }
    };
    
    updatePageContext();
  }, [pathname]);

  return null;
}