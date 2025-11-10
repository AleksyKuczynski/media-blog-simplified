// src/main/components/Article/BalloonTip.tsx
/**
 * BalloonTip - Interactive tooltip component for inline link explanations
 * 
 * Features:
 * - Click to show/hide on both desktop and mobile
 * - Click outside to close
 * - Visible underlined + colored link text
 * - Touch-friendly with proper tap targets
 * - Accessible with keyboard support
 */

'use client';

import { useState, useRef } from 'react';
import { useOutsideClick } from '@/main/lib/hooks/useOutsideClick';

interface BalloonTipProps {
  text: string;
  url: string;
}

export function BalloonTip({ text, url }: BalloonTipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLSpanElement>(null);

  // Close when clicking outside (using project's useOutsideClick signature)
  useOutsideClick(
    containerRef,
    toggleRef,
    isOpen,
    () => setIsOpen(false)
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Toggle on Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    // Note: Escape key is handled by useOutsideClick hook
  };

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
    >
      {/* Clickable link text */}
      <span
        ref={toggleRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-label={`Show tooltip: ${url}`}
        className="
          cursor-pointer underline decoration-2
          text-pr-cont hover:text-pr-fix
          transition-colors duration-200
          
          /* Touch-friendly tap target - minimum 44x44px */
          inline-block min-h-[44px] py-2 -my-2
          
          /* Theme variants for underline style */
          theme-default:decoration-pr-cont/50 theme-default:hover:decoration-pr-fix
          theme-rounded:decoration-pr-cont/60 theme-rounded:hover:decoration-pr-fix
          theme-sharp:decoration-pr-cont theme-sharp:hover:decoration-pr-fix
          
          /* Focus visible for keyboard navigation */
          focus:outline-none focus:ring-2 focus:ring-pr-cont/50 focus:ring-offset-2
        "
      >
        {text}
      </span>

      {/* Balloon tip popup */}
      {isOpen && (
        <span
          className="
            absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
            min-w-[200px] max-w-xs w-max
            p-3 text-sm
            z-50
            
            /* Colors - high contrast for readability */
            bg-on-sf text-sf
            shadow-lg
            
            /* Text handling */
            break-words
            
            /* Animation */
            animate-in fade-in-0 zoom-in-95 duration-200
            
            /* Theme variants */
            theme-default:rounded-lg
            theme-rounded:rounded-xl
            theme-sharp:border-2 theme-sharp:border-pr-cont
            
            /* Arrow pointer */
            before:content-['']
            before:absolute before:top-full before:left-1/2
            before:transform before:-translate-x-1/2
            before:border-8 before:border-transparent
            before:border-t-on-sf
            theme-sharp:before:border-t-pr-cont
          "
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </span>
      )}
    </span>
  );
}