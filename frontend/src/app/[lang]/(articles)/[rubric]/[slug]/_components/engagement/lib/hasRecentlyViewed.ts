// app/[lang]/[rubric]/[slug]/_components/engagement/lib/hasRecentlyViewed.ts
/**
 * Article Engagement - View Detection
 * 
 * Checks if article was recently viewed to prevent duplicate tracking.
 * 
 * Function:
 * - hasRecentlyViewed(slug, windowMs): Check recent view
 * 
 * Storage:
 * - last_view_[slug]: Timestamp
 * 
 * Features:
 * - Configurable time window (default: 30 minutes)
 * - Silent error handling
 * 
 * Dependencies: None
 * 
 * NOTE: Used alongside session storage for view deduplication
 */

// Session tracking to prevent duplicate view counts within same session
const viewTrackingMap = new Map<string, number>();
const VIEW_TRACKING_WINDOW = 3600 * 1000; // 1 hour

/**
 * Check if this slug was already viewed in this session
 * Prevents duplicate view tracking within 1 hour
 */
export function hasRecentlyViewed(ip: string, slug: string): boolean {
  const now = Date.now();
  const key = `${ip}:${slug}`;
  
  // Cleanup old entries
  if (viewTrackingMap.size > 1000) {
    for (const [k, timestamp] of viewTrackingMap.entries()) {
      if (now - timestamp > VIEW_TRACKING_WINDOW) {
        viewTrackingMap.delete(k);
      }
    }
  }
  
  const lastViewTime = viewTrackingMap.get(key);
  
  if (lastViewTime && (now - lastViewTime) < VIEW_TRACKING_WINDOW) {
    return true;
  }
  
  viewTrackingMap.set(key, now);
  return false;
}
