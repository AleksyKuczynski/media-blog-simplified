// src/main/components/Article/TableOfContentsLink.tsx
'use client';

import { useRouter } from 'next/navigation';

interface TableOfContentsLinkProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

// Navigation heights (should match your actual navigation component heights)
const NAVIGATION_HEIGHT = {
  mobile: 64,  // h-16 from MobileNav
  desktop: 96, // h-24 from DesktopNav
  buffer: 8,   // Small buffer for better UX
} as const;

/**
 * Get current navigation height based on viewport
 */
function getNavigationOffset(): number {
  if (typeof window === 'undefined') return 0;
  
  // Check if desktop navigation is visible (xl breakpoint = 1280px)
  const isDesktop = window.innerWidth >= 1280;
  const baseHeight = isDesktop ? NAVIGATION_HEIGHT.desktop : NAVIGATION_HEIGHT.mobile;
  
  return baseHeight + NAVIGATION_HEIGHT.buffer;
}

/**
 * Scroll to element with offset for fixed navigation
 * Falls back to scrollIntoView if offset calculation fails
 */
function scrollToElementWithOffset(element: HTMLElement) {
  try {
    // Get element position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - getNavigationOffset();
    
    // Smooth scroll to calculated position
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } catch (error) {
    // Fallback to standard scrollIntoView (CSS scroll-margin will handle offset)
    console.warn('Offset scroll failed, using fallback:', error);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function TableOfContentsLink({ id, className, children }: TableOfContentsLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with id "${id}" not found`);
      return;
    }
    
    // Scroll with offset
    scrollToElementWithOffset(element);
    
    // Update URL without triggering navigation
    router.push(`#${id}`, { scroll: false });
  };

  return (
    <a 
      href={`#${id}`} 
      onClick={handleClick}
      className={className}
      aria-label={`Jump to section: ${children}`}
    >
      {children}
    </a>
  );
}