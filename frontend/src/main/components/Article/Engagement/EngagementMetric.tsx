// frontend/src/main/components/Article/Engagement/EngagementMetric.tsx
/**
 * Engagement Metric Component - UPDATED FOR VERTICAL LAYOUT
 * 
 * Unified, reusable display component for views, likes, and shares
 * Now supports vertical orientation with icon above count for sticky sidebar
 */

'use client';

import { ReactNode } from 'react';

export interface EngagementMetricProps {
  /** Metric type identifier */
  type: 'view' | 'like' | 'share';
  
  /** Current count value */
  count: number;
  
  /** Icon SVG element */
  icon: ReactNode;
  
  /** Is this metric interactive? (button vs static display) */
  interactive?: boolean;
  
  /** Is the metric active? (e.g., liked) */
  isActive?: boolean;
  
  /** Is an action in progress? */
  isLoading?: boolean;
  
  /** Click handler for interactive metrics */
  onClick?: () => void;
  
  /** Is the metric disabled? */
  disabled?: boolean;
  
  /** Accessibility label */
  ariaLabel?: string;
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * Unified metric display component with vertical layout
 * 
 * @example
 * ```tsx
 * <EngagementMetric
 *   type="view"
 *   count={42}
 *   icon={<EyeIcon />}
 * />
 * 
 * <EngagementMetric
 *   type="like"
 *   count={15}
 *   icon={<HeartIcon />}
 *   interactive
 *   isActive={isLiked}
 *   onClick={handleLike}
 * />
 * ```
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
  // Vertical layout: flex-col, centered, compact padding
  const baseClasses = 'flex flex-col items-center justify-center gap-1 p-2 transition-all rounded-lg';
  
  const stateClasses = interactive
    ? isActive
      ? getActiveClasses(type)
      : getInactiveClasses(type)
    : 'text-on-sf-var'; // Static display
  
  const interactionClasses = interactive && !disabled
    ? 'cursor-pointer hover:scale-105'
    : disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const loadingClasses = isLoading ? 'animate-pulse' : '';

  const finalClasses = `${baseClasses} ${stateClasses} ${interactionClasses} ${loadingClasses} ${className}`;

  const content = (
    <>
      {/* Icon - slightly larger for better visibility */}
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
        {icon}
      </div>
      {/* Count - below icon, smaller font */}
      <span className="text-xs sm:text-sm font-medium tabular-nums">
        {isLoading ? '...' : formatCount(count)}
      </span>
    </>
  );

  // Render as button if interactive
  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isLoading}
        className={finalClasses}
        aria-label={ariaLabel || `${type} (${count})`}
        aria-pressed={isActive}
      >
        {content}
      </button>
    );
  }

  // Render as static div
  return (
    <div
      className={finalClasses}
      aria-label={ariaLabel || `${count} ${type}s`}
    >
      {content}
    </div>
  );
}

/**
 * Get active state classes for metric type
 */
function getActiveClasses(type: 'view' | 'like' | 'share'): string {
  switch (type) {
    case 'like':
      return 'text-red-600 bg-red-50/50 hover:bg-red-100/50';
    case 'share':
      return 'text-blue-600 bg-blue-50/50 hover:bg-blue-100/50';
    default:
      return 'text-on-sf-var bg-sf-hi/30';
  }
}

/**
 * Get inactive state classes for metric type
 */
function getInactiveClasses(type: 'view' | 'like' | 'share'): string {
  switch (type) {
    case 'like':
      return 'text-on-sf-var hover:text-red-600 hover:bg-red-50/30';
    case 'share':
      return 'text-on-sf-var hover:text-blue-600 hover:bg-blue-50/30';
    default:
      return 'text-on-sf-var hover:bg-sf-hi/20';
  }
}

/**
 * Format count for display (compact notation for large numbers)
 */
function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}