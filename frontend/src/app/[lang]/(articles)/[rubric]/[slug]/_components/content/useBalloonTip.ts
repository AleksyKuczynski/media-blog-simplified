// app/[lang]/[rubric]/[slug]/_components/content/useBalloonTip.ts
/**
 * useBalloonTip - Custom hook for balloon tooltip logic
 * 
 * Manages state and behavior for interactive balloon tooltips.
 * Handles positioning, click/keyboard interactions, and auto-closing.
 * 
 * Features:
 * - Click to toggle tooltip visibility
 * - Keyboard support (Enter/Space)
 * - Auto-close on outside click
 * - Auto-close on scroll
 * - Dynamic positioning to stay within viewport
 * - Fixed positioning relative to viewport
 * 
 * Positioning Logic:
 * - Default: Centered above trigger element
 * - Adjusts left/right if overflowing viewport edges
 * - 16px margin from viewport edges
 * - 8px gap above trigger element
 * 
 * Event Handlers:
 * - Outside click: useOutsideClick hook
 * - Scroll: window scroll listener (added/removed dynamically)
 * - Escape key: handled by useOutsideClick
 * 
 * Dependencies:
 * - @/lib/hooks/useOutsideClick
 * 
 * @returns {Object} Tooltip state, refs, and event handlers
 */

import { useState, useRef, useLayoutEffect } from 'react';
import { useOutsideClick } from '@/lib/hooks/useOutsideClick';

export function useBalloonTip() {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLSpanElement>(null);
  const toggleRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const scrollHandlerRef = useRef<(() => void) | null>(null);

  // Close on outside click
  useOutsideClick(
    containerRef,
    toggleRef,
    isOpen,
    () => {
      setIsOpen(false);
      // Clean up scroll listener
      if (scrollHandlerRef.current) {
        window.removeEventListener('scroll', scrollHandlerRef.current);
        scrollHandlerRef.current = null;
      }
    }
  );

  // Calculate tooltip position to keep it within viewport
  useLayoutEffect(() => {
    if (!isOpen || !tooltipRef.current || !toggleRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = toggleRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const margin = 16;

    // Position tooltip above the trigger
    const top = triggerRect.top - tooltipRect.height - 8;

    // Center horizontally relative to trigger
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

    // Keep within viewport bounds
    if (left < margin) {
      left = margin;
    } else if (left + tooltipRect.width > viewportWidth - margin) {
      left = viewportWidth - tooltipRect.width - margin;
    }

    setTooltipStyle({
      top: `${top}px`,
      left: `${left}px`,
    });
  }, [isOpen]);

  // Toggle tooltip and manage scroll listener
  const toggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen) {
      // Add scroll listener when opening
      const handleScroll = () => {
        setIsOpen(false);
        window.removeEventListener('scroll', handleScroll);
        scrollHandlerRef.current = null;
      };
      
      scrollHandlerRef.current = handleScroll;
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else if (scrollHandlerRef.current) {
      // Remove scroll listener when closing
      window.removeEventListener('scroll', scrollHandlerRef.current);
      scrollHandlerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return {
    isOpen,
    tooltipStyle,
    containerRef,
    toggleRef,
    tooltipRef,
    handleClick,
    handleKeyDown,
  };
}