// app/[lang]/[rubric]/[slug]/_components/engagement/EngagementMetricSkeleton.tsx
/**
 * Article Engagement - Metric Loading Skeleton
 * 
 * Placeholder component shown during data fetching.
 * Matches EngagementMetric dimensions with pulse animation.
 * 
 * Architecture:
 * - Fixed dimensions matching EngagementMetric
 * - Pulse animation via Tailwind animate-pulse
 * - Semantic color matching (on-pr with opacity)
 * 
 * Features:
 * - Icon placeholder (circular shape)
 * - Count placeholder (rectangular bar)
 * - Vertical layout matching metric display
 * 
 * Dependencies:
 * - ./engagement.styles (ENGAGEMENT_LOADING_STYLES)
 */

import { ENGAGEMENT_LOADING_STYLES } from './engagement.styles';

const styles = ENGAGEMENT_LOADING_STYLES.skeleton;

export function EngagementMetricSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      <div className={styles.count} />
    </div>
  );
}