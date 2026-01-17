// app/[lang]/[rubric]/[slug]/_components/engagement/EngagementErrorToast.tsx
/**
 * Article Engagement - Error Notification Toast
 * 
 * Fixed-position toast for engagement operation errors.
 * Auto-dismisses after 5 seconds with manual close option.
 * 
 * Architecture:
 * - Fixed positioning: Top-center of viewport
 * - Conditional rendering: Only shows when error exists
 * - Auto-dismiss: Parent component controls timeout
 * 
 * Features:
 * - Manual close button
 * - Accessibility role="alert" for screen readers
 * - Responsive width with max constraint
 * - Error styling (red theme)
 * 
 * Dependencies:
 * - ./engagement.styles (ENGAGEMENT_ERROR_STYLES)
 * 
 * @param error - Error message string or null
 * @param onClose - Close handler (clears error in parent)
 */

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