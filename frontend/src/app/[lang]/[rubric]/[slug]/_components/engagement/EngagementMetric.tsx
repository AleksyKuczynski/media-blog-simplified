// app/[lang]/[rubric]/[slug]/_components/engagement/EngagementMetric.tsx
/**
 * Article Engagement - Metric Display Component
 * 
 * Unified display for views, likes, and shares.
 * Supports both static display and interactive buttons.
 * 
 * Features:
 * - Vertical layout (icon above count)
 * - Loading states
 * - Active/inactive states
 * - Hover effects
 * - Accessibility labels
 * 
 * Dependencies:
 * - React (ReactNode type)
 * 
 * @param type - Metric type ('view' | 'like' | 'share')
 * @param count - Current count
 * @param icon - Icon component
 * @param interactive - Enable button interaction
 * @param isActive - Active state (liked/shared)
 * @param isLoading - Loading state
 * @param onClick - Click handler for interactive metrics
 * @param disabled - Disable interaction
 * @param ariaLabel - Accessibility label
 * @param className - Optional styling
 */

'use client';

import { ReactNode } from 'react';

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

/**
 * Get active state classes
 */
function getActiveClasses(type: 'view' | 'like' | 'share'): string {
  switch (type) {
    case 'like':
      return 'text-error';
    case 'share':
      return 'text-on-pr';
    default:
      return 'text-on-pr';
  }
}

/**
 * Get inactive state classes
 */
function getInactiveClasses(type: 'view' | 'like' | 'share'): string {
  switch (type) {
    case 'like':
      return 'text-on-pr/70 hover:text-error';
    case 'share':
      return 'text-on-pr/70 hover:text-on-pr';
    default:
      return 'text-on-pr/70';
  }
}

/**
 * Unified metric display component with vertical layout
 */
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
  const baseClasses = 'flex md:flex-col gap-1 items-center justify-center transition-all rounded-lg';
  
  const stateClasses = interactive
    ? isActive
      ? getActiveClasses(type)
      : getInactiveClasses(type)
    : 'text-on-sf-var';
  
  const interactionClasses = interactive && !disabled
    ? 'cursor-pointer hover:scale-105'
    : disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const loadingClasses = isLoading ? 'animate-pulse' : '';

  const finalClasses = `${baseClasses} ${stateClasses} ${interactionClasses} ${loadingClasses} ${className}`;

  const content = (
    <>
      {/* Icon */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
        {icon}
      </div>
      {/* Count */}
      <span className="text-xs sm:text-sm font-medium tabular-nums">
        {isLoading ? '...' : count}
      </span>
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        className={finalClasses}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={finalClasses} aria-label={ariaLabel}>
      {content}
    </div>
  );
}