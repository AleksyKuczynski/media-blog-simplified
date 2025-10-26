// src/main/components/Navigation/SearchButton.tsx
// Search toggle button for mobile navigation

'use client'

import React from 'react';

interface SearchButtonProps {
  isOpen: boolean;
  onClick: () => void;
  ariaControls: string;
  openLabel: string;
  closeLabel: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * SearchButton - Toggle button for mobile search
 * Shows search icon when closed, X icon when open
 */
export default function SearchButton({
  isOpen,
  onClick,
  ariaControls,
  openLabel,
  closeLabel,
  buttonRef
}: SearchButtonProps) {
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
          // Search icon
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        )}
      </div>
    </button>
  );
}