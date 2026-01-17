// app/[lang]/[rubric]/[slug]/_components/content/BalloonTip.tsx
/**
 * BalloonTip - Interactive tooltip component for inline content explanations
 * 
 * Displays a clickable trigger text with a popup tooltip.
 * Used for non-link markdown references (e.g., terms, definitions, notes).
 * 
 * Features:
 * - Click/tap to show/hide tooltip
 * - Keyboard accessible (Enter/Space to toggle, Escape to close)
 * - Touch-friendly with proper tap targets
 * - Auto-closes on outside click or scroll
 * - Responsive positioning within viewport
 * - Visible styled trigger (dotted underline, colored text)
 * 
 * Visual Design:
 * - Trigger: Dotted underline, primary color text
 * - Tooltip: Rounded card with shadow, appears above trigger
 * - Responsive width: 90vw on mobile, max 512px on desktop
 * 
 * Markdown Processing:
 * - Created by processLinks.ts for non-HTTP, non-slug links
 * - Triggered by data-balloon-tip attribute in HTML
 * - Rendered via SpanHandler in markdown-component-map
 * 
 * Architecture:
 * - Presentation component (this file)
 * - Logic in useBalloonTip hook
 * - Styles in article.styles.ts (BLOCKS_STYLES.balloonTip)
 * 
 * Dependencies:
 * - ./useBalloonTip (tooltip logic)
 * - ../article.styles (BLOCKS_STYLES)
 * 
 * Usage:
 * Markdown: [trigger text](explanation text)
 * Renders: <BalloonTip text="trigger text" url="explanation text" />
 * 
 * @param text - Trigger text to display (clickable)
 * @param url - Tooltip content to show on click
 */

'use client';

import { BLOCKS_STYLES } from '../article.styles';
import { useBalloonTip } from './useBalloonTip';

interface BalloonTipProps {
  text: string;
  url: string;
}

const styles = BLOCKS_STYLES.balloonTip;

export function BalloonTip({ text, url }: BalloonTipProps) {
  const {
    isOpen,
    tooltipStyle,
    containerRef,
    toggleRef,
    tooltipRef,
    handleClick,
    handleKeyDown,
  } = useBalloonTip();

  return (
    <span ref={containerRef} className="relative">
      {/* Clickable trigger text */}
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

      {/* Tooltip popup */}
      {isOpen && (
        <span
          ref={tooltipRef}
          className={styles.tooltip}
          style={tooltipStyle}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
        >
          {url}
        </span>
      )}
    </span>
  );
}