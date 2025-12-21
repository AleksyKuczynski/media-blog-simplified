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