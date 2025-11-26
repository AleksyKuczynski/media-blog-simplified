// src/main/components/Interface/Collapsible.tsx
// Generic collapsible component - reusable across the site
// Supports responsive behavior: collapsed on mobile, expanded on desktop

'use client'

import { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Collapsible - Generic expandable/collapsible section
 * 
 * Features:
 * - Responsive: Can be collapsed on mobile, expanded on desktop
 * - Accessible: ARIA attributes for screen readers
 * - Animated: Smooth chevron rotation and content reveal
 * - Customizable: Styling via className props
 * 
 * Usage:
 * <Collapsible 
 *   title="Search Tips"
 *   defaultOpen={false}
 *   breakpoint="md"
 * >
 *   <ul>...</ul>
 * </Collapsible>
 */
export default function Collapsible({
  title,
  children,
  defaultOpen = false,
  breakpoint,
  className = '',
  titleClassName = '',
  contentClassName = '',
  icon,
  ariaLabel,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Determine if should be force-expanded on larger screens
  const breakpointClass = breakpoint ? {
    'sm': 'sm:block',
    'md': 'md:block',
    'lg': 'lg:block',
    'xl': 'xl:block',
  }[breakpoint] : '';

  const buttonId = `collapsible-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `${buttonId}-content`;

  return (
    <div className={`collapsible ${className}`}>
      {/* Collapsible Header Button */}
      <button
        id={buttonId}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={ariaLabel || title}
        className={`
          flex items-center justify-between w-full
          px-4 py-3
          bg-sf-hi hover:bg-sf-hst
          rounded-lg
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2
          ${titleClassName}
          ${breakpoint ? `${breakpoint}:pointer-events-none ${breakpoint}:cursor-default` : ''}
        `}
        type="button"
        tabIndex={breakpoint ? undefined : 0}
      >
        {/* Title with optional icon */}
        <div className="flex items-center gap-3">
          {icon && <span className="text-on-sf-var">{icon}</span>}
          <span className="font-medium text-on-sf">
            {title}
          </span>
        </div>

        {/* Chevron indicator - hidden on large screens if breakpoint is set */}
        <span 
          className={`
            text-on-sf-var transition-transform duration-200
            ${isOpen ? 'rotate-180' : 'rotate-0'}
            ${breakpoint ? `${breakpoint}:hidden` : ''}
          `}
          aria-hidden="true"
        >
          <ChevronDownIcon className="w-5 h-5" />
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
          ${breakpoint ? `${breakpointClass} ${breakpoint}:max-h-none ${breakpoint}:opacity-100 ${breakpoint}:mt-2` : ''}
          ${contentClassName}
        `}
      >
        <div className="px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}