import { ENGAGEMENT_ERROR_STYLES } from './engagement.styles';

interface EngagementErrorToastProps {
  error: string | null;
  onClose: () => void;
}

const styles = ENGAGEMENT_ERROR_STYLES.toast;

export function EngagementErrorToast({ error, onClose }: EngagementErrorToastProps) {
  if (!error) return null;

  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        <span>{error}</span>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Dismiss error"
        >
          ×
        </button>
      </div>
    </div>
  );
}