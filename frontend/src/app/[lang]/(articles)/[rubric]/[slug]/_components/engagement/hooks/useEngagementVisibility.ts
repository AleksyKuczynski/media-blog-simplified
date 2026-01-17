// app/[lang]/[rubric]/[slug]/_components/engagement/hooks/useEngagementVisibility.ts
/**
 * Article Engagement - Visibility Hook
 * 
 * Manages engagement bar visibility based on scroll position and element overlap.
 * Hides bar when it would overlap with RelatedArticles or Footer sections.
 * 
 * Features:
 * - Scroll threshold detection (300px)
 * - Rectangle overlap detection
 * - Performance optimization with requestAnimationFrame
 * - Configurable element IDs
 * 
 * Algorithm:
 * 1. Check if scrolled past threshold
 * 2. Calculate engagement bar's fixed position area
 * 3. Check if RelatedArticles or Footer overlaps that area
 * 4. Hide if overlap detected
 * 
 * Dependencies: None (pure client-side logic)
 * 
 * @param options - Configuration options
 * 
 * @returns {boolean} Visibility state
 */

import { useState, useEffect } from 'react';
import { isScrollLocked } from '@/lib/utils/bodyScrollLock';

export interface UseEngagementVisibilityOptions {
  scrollThreshold?: number;
  relatedSectionId?: string;
  footerId?: string;
  barDimensions?: {
    height: number;
    width: number;
    bottom: number;
    left: number;
  };
}

export function useEngagementVisibility({
  scrollThreshold = 300,
  relatedSectionId = 'related-articles-section',
  footerId = 'site-footer',
  barDimensions = {
    height: 200,
    width: 80,
    bottom: 16,
    left: 16,
  },
}: UseEngagementVisibilityOptions = {}): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // CRITICAL: Ignore scroll events when body scroll is locked
      // This prevents hiding the bar when modals open
      if (isScrollLocked()) {
        return;
      }

      const scrollY = window.scrollY;
      
      // First check: Has user scrolled past threshold?
      if (scrollY <= scrollThreshold) {
        setIsVisible(false);
        return;
      }
      
      // Calculate engagement bar's fixed position on screen
      const barRect = {
        left: barDimensions.left,
        right: barDimensions.left + barDimensions.width,
        top: window.innerHeight - barDimensions.bottom - barDimensions.height,
        bottom: window.innerHeight - barDimensions.bottom,
      };
      
      // Check overlap with RelatedArticles section
      const relatedSection = document.getElementById(relatedSectionId);
      if (relatedSection) {
        const relatedRect = relatedSection.getBoundingClientRect();
        
        const overlaps = !(
          relatedRect.right < barRect.left ||
          relatedRect.left > barRect.right ||
          relatedRect.bottom < barRect.top ||
          relatedRect.top > barRect.bottom
        );
        
        if (overlaps) {
          setIsVisible(false);
          return;
        }
      }
      
      // Check overlap with Footer
      const footer = document.getElementById(footerId);
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        
        const overlaps = !(
          footerRect.right < barRect.left ||
          footerRect.left > barRect.right ||
          footerRect.bottom < barRect.top ||
          footerRect.top > barRect.bottom
        );
        
        if (overlaps) {
          setIsVisible(false);
          return;
        }
      }
      
      // Show if: scrolled past threshold AND no overlap
      setIsVisible(true);
    };

    // Initial check
    handleScroll();
    
    // Use requestAnimationFrame for smooth performance
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollThreshold, relatedSectionId, footerId, barDimensions]);

  return isVisible;
}