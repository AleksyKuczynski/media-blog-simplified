// app/[lang]/[rubric]/[slug]/_components/engagement/EngagementMetric.tsx
/**
 * Article Engagement - Metric Display Component
 * 
 * Reusable metric display with icon + count.
 * Supports both static display and interactive button modes.
 * 
 * Architecture:
 * - Conditional wrapper: Button for interactive, div for static
 * - State styling: Active/inactive states per metric type
 * - Responsive sizing: Icon and count scale via Tailwind
 * 
 * Features:
 * - Type-specific color states (view/like/share)
 * - Loading state with pulse animation
 * - Disabled state handling
 * - Hover effects on interactive mode
 * - Accessibility labels
 * 
 * Dependencies:
 * - ./engagement.styles (ENGAGEMENT_METRIC_STYLES)
 * 
 * @param type - Metric type ('view' | 'like' | 'share')
 * @param count - Numeric count to display
 * @param icon - React node for icon (from EngagementIcons)
 * @param interactive - Enable button wrapper with click handler
 * @param isActive - Active state styling (for like/share)
 * @param isLoading - Show loading state with ellipsis
 * @param onClick - Click handler (required if interactive)
 * @param disabled - Disable interaction
 * @param ariaLabel - Accessibility label
 * @param className - Optional additional styles
 */

'use client';

import { ReactNode } from 'react';
import { ENGAGEMENT_METRIC_STYLES } from './engagement.styles';

export interface EngagementMetricProps {
  type: 'view' | 'like' | 'share';
  count: number;
  icon: ReactNode;
  interactive?: boolean;
  isActive?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

const styles = ENGAGEMENT_METRIC_STYLES;

export function EngagementMetric({
  type,
  count,
  icon,
  interactive = false,
  isActive = false,
  isLoading = false,
  onClick,
  disabled = false,
  ariaLabel,
  className = '',
}: EngagementMetricProps) {
  const stateClasses = isActive
    ? styles.states[type].active
    : styles.states[type].inactive;
  
  const interactionClasses = interactive && !disabled
    ? styles.container.interactive
    : disabled
    ? styles.container.disabled
    : '';

  const loadingClasses = isLoading ? styles.container.loading : '';

  const containerClasses = `
    ${styles.container.base}
    ${stateClasses}
    ${interactionClasses}
    ${loadingClasses}
    ${className}
  `;

  const content = (
    <>
      <div className={styles.icon.wrapper}>
        {icon}
      </div>
      <span className={styles.count.base}>
        {isLoading ? '...' : count}
      </span>
    </>
  );

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={containerClasses}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={containerClasses} aria-label={ariaLabel}>
      {content}
    </div>
  );
}