// app/[lang]/[rubric]/[slug]/_components/ScrollToTopButton.tsx
/**
 * Article Page - Scroll to Top Button
 * 
 * Client component with fixed positioning.
 * Appears after user scrolls down, smooth scrolls to top on click.
 * 
 * Features:
 * - Visibility threshold: 400px scroll
 * - Smooth scroll behavior
 * - Accessible with keyboard navigation
 * 
 * Dependencies:
 * - article.styles.ts (WIDGETS_STYLES.scrollToTop)
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@/shared/primitives/Icons';
import { FloatingButton } from '@/shared/primitives/FloatingButton';
import { WIDGETS_STYLES } from './article.styles';

const styles = WIDGETS_STYLES.scrollToTop;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <FloatingButton 
      className={styles.button} 
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <ChevronUpIcon className={styles.icon} />
    </FloatingButton>
  );
}