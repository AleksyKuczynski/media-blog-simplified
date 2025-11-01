// frontend/src/main/components/Article/Engagement/EngagementMetric.tsx
/**
 * Engagement Metric Component
 * 
 * Unified, reusable display component for views, likes, and shares
 * Provides consistent styling and behavior across all metrics
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
 * Unified metric display component
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
  const baseClasses = 'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all';
  
  const stateClasses = interactive
    ? isActive
      ? getActiveClasses(type)
      : getInactiveClasses(type)
    : 'text-gray-600'; // Static display
  
  const interactionClasses = interactive && !disabled
    ? 'cursor-pointer'
    : disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  const loadingClasses = isLoading ? 'animate-pulse' : '';

  const finalClasses = `${baseClasses} ${stateClasses} ${interactionClasses} ${loadingClasses} ${className}`;

  const content = (
    <>
      <div className="w-5 h-5 flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium tabular-nums">
        {isLoading ? '...' : count.toLocaleString()}
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
      return 'text-red-600 bg-red-50 hover:bg-red-100';
    case 'share':
      return 'text-blue-600 bg-blue-50 hover:bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * Get inactive state classes for metric type
 */
function getInactiveClasses(type: 'view' | 'like' | 'share'): string {
  switch (type) {
    case 'like':
      return 'text-gray-600 hover:text-red-600 hover:bg-gray-50';
    case 'share':
      return 'text-gray-600 hover:text-blue-600 hover:bg-gray-50';
    default:
      return 'text-gray-600 hover:bg-gray-50';
  }
}