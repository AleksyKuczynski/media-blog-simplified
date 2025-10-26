// src/main/components/Navigation/HamburgerButton.tsx
// Hamburger menu toggle button for mobile navigation

'use client'

import React from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
  openLabel: string;
  closeLabel: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * HamburgerButton - Toggle button for mobile menu
 * Shows hamburger icon when closed, X icon when open
 */
export default function HamburgerButton({
  isOpen,
  onClick,
  ariaControls,
  openLabel,
  closeLabel,
  buttonRef
}: HamburgerButtonProps) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      aria-label={isOpen ? closeLabel : openLabel}
      className="
        p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf 
        transition-all duration-200 
        active:scale-95 touch-manipulation
      "
      type="button"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {isOpen ? (
          // Close icon (X)
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        ) : (
          // Hamburger icon (three lines)
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        )}
      </div>
    </button>
  );
}