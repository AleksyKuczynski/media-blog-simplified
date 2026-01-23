// features/navigation/Header/NavigationLink.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
  title?: string;
  tabIndex?: number;
  itemProp?: string;
  itemScope?: boolean;
  itemType?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * NavigationLink - Wrapper for navigation links with mobile menu cleanup
 * 
 * Automatically cleans up mobile menu history state before navigation
 * to prevent back button from reopening the mobile menu.
 * 
 * Used by:
 * - Logo component (mobile variant)
 * - NavLinks (mobile variant)
 * - Any other navigation that opens mobile panels
 */
export function NavigationLink({ 
  href, 
  children, 
  onClick,
  ...props 
}: NavigationLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Only clean up if navigating to a different page
    if (pathname !== href && pathname !== `${href}/`) {
      const currentState = window.history.state || {};
      
      // Remove mobile menu/search flags if they exist
      if (currentState.mobileMenuOpen || currentState.mobileSearchOpen) {
        const cleanState = { ...currentState };
        delete cleanState.mobileMenuOpen;
        delete cleanState.mobileSearchOpen;
        
        window.history.replaceState(
          cleanState,
          '',
          window.location.href
        );
      }
    }
  };

  return (
    <Link 
      href={href}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
}