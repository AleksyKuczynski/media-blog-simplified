// src/main/components/Navigation/NavLinksClient.tsx - Unified Navigation Styling
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';

interface NavLinksClientProps {
  lang: Lang;
  translations: NavigationTranslations;
}

// Unified navigation styling - Desktop style for all contexts
const NAV_STYLES = {
  // Base desktop styling used for all contexts
  base: [
    'px-4', 'py-2', 'rounded-full', 'font-medium',
    'transition-all', 'duration-200',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-primary', 'focus:ring-offset-2',
    'touch-manipulation' // Added for mobile touch support
  ],
  normal: [
    'text-on-sf-var', 'hover:text-on-sf', 'hover:bg-sf-hi'
  ],
  active: [
    'bg-sf-hi', 'text-pr-cont', 'font-bold'
  ],
  
  // Context-specific spacing adjustments only
  contextAdjustments: {
    mobile: {
      // Slightly larger touch targets for mobile, but keeping desktop styling
      spacing: ['px-6', 'py-3'] // Replaces px-4 py-2 for better mobile UX
    },
    desktop: {
      spacing: [] // No adjustments needed
    }
  }
} as const;

// Helper function to detect navigation context
function detectNavigationContext(linkElement: HTMLElement): 'desktop' | 'mobile' {
  // Check if we're in a mobile navigation context
  const mobileNav = linkElement.closest('[role="dialog"]'); // Mobile nav uses role="dialog"
  const desktopNav = linkElement.closest('.xl\\:block'); // Desktop nav has xl:block class
  
  if (mobileNav) return 'mobile';
  if (desktopNav) return 'desktop';
  
  // Fallback: check screen size via CSS classes or viewport
  const isMobileViewport = window.innerWidth < 1280; // xl breakpoint
  return isMobileViewport ? 'mobile' : 'desktop';
}

// Helper function to apply classes
function applyClasses(element: HTMLElement, classesToAdd: string[], classesToRemove: string[] = []) {
  // Remove old classes first
  if (classesToRemove.length > 0) {
    element.classList.remove(...classesToRemove);
  }
  
  // Add new classes
  element.classList.add(...classesToAdd);
}

export default function NavLinksClient({ lang }: NavLinksClientProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Find all navigation links
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach((link) => {
      const href = link.getAttribute('data-href');
      const navSection = link.getAttribute('data-nav-section');
      if (!href || !navSection) return;

      const linkElement = link as HTMLElement;
      const spanElement = linkElement.querySelector('span[itemProp="name"]') as HTMLElement;
      
      // Detect context for spacing adjustments only
      const context = detectNavigationContext(linkElement);
      
      // Enhanced active state detection
      const isActive = pathname.startsWith(`/ru${href}`);
      const isExactMatch = pathname === `/ru${href}` || (href === '/' && pathname === '/ru');
      const isCurrentPage = isActive || isExactMatch;
      
      // Clear all existing style classes to start fresh
      const allPossibleClasses = [
        // Base classes
        ...NAV_STYLES.base,
        ...NAV_STYLES.normal,
        ...NAV_STYLES.active,
        // Context spacing
        ...NAV_STYLES.contextAdjustments.mobile.spacing,
        // Legacy mobile classes that might exist
        'block', 'px-8', 'py-4', 'rounded-2xl', 'text-lg', 
        'md:hover:shadow-md', 'md:hover:scale-102', 'relative', 'overflow-hidden',
        'before:absolute', 'before:inset-0', 'before:bg-gradient-to-r',
        'before:from-transparent', 'before:via-white/5', 'before:to-transparent',
        'before:translate-x-[-100%]', 'hover:before:translate-x-[100%]',
        'before:transition-transform', 'before:duration-500',
        'active:bg-sf-hst', 'active:scale-95', 'shadow-md'
      ];
      linkElement.classList.remove(...allPossibleClasses);
      
      // Apply unified base styles
      applyClasses(linkElement, NAV_STYLES.base);
      
      // Apply context-specific spacing adjustments
      if (context === 'mobile' && NAV_STYLES.contextAdjustments.mobile.spacing.length > 0) {
        // Remove default spacing and apply mobile spacing
        linkElement.classList.remove('px-4', 'py-2');
        applyClasses(linkElement, NAV_STYLES.contextAdjustments.mobile.spacing);
      }
      
      if (isCurrentPage) {
        // Active state styling - same for both contexts
        applyClasses(linkElement, NAV_STYLES.active);
        
        // Update ARIA attributes for accessibility and SEO
        linkElement.setAttribute('aria-current', 'page');
        linkElement.setAttribute('data-active', 'true');
        
        // Add structured data indicator
        if (spanElement) {
          spanElement.setAttribute('data-current-page', 'true');
        }
        
      } else {
        // Normal state styling - same for both contexts
        applyClasses(linkElement, NAV_STYLES.normal);
        
        // Remove active ARIA attributes
        linkElement.removeAttribute('aria-current');
        linkElement.setAttribute('data-active', 'false');
        
        // Remove structured data indicator
        if (spanElement) {
          spanElement.removeAttribute('data-current-page');
        }
      }
      
      // Add context data attribute for debugging
      linkElement.setAttribute('data-nav-context', context);
    });
    
  }, [pathname, lang]);

  // Update page title in document for SEO
  useEffect(() => {
    // This effect can handle page title updates if needed
    // Currently preserving existing behavior
  }, [pathname]);

  return null; // This component only manages styling, renders nothing
}