// src/app/[lang]/[rubric]/[slug]/_components/content/blocks/BalloonTip.tsx
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
import { BLOCKS_STYLES } from '../../article.styles';

interface BalloonTipProps {
  text: string;
  url: string;
}

const styles = BLOCKS_STYLES.balloonTip;

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
      className={styles.container}
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
        className={styles.trigger}
      >
        {text}
      </span>

      {/* Balloon tip popup */}
      {isOpen && (
        <span
          className={styles.tooltip}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </span>
      )}
    </span>
  );
}