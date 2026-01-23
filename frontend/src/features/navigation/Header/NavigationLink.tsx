// features/navigation/Header/NavigationLink.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { cleanupPanelHistoryStates } from './utils/navigationLink.utils';

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
 * NavigationLink - Wrapper for navigation links with mobile panel cleanup
 * 
 * Automatically cleans up mobile panel history states before navigation
 * to prevent back button from reopening panels.
 * 
 * Used by:
 * - Logo component
 * - NavLinks component
 * - Any other navigation that may open mobile panels
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

    // Clean up panel history states
    cleanupPanelHistoryStates(pathname, href);
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