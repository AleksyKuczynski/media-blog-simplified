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