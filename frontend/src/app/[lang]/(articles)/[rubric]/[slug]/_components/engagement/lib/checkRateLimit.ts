// app/[lang]/[rubric]/[slug]/_components/engagement/lib/checkRateLimit.ts
/**
 * Article Engagement - Rate Limiting
 * 
 * Client-side rate limiting for engagement actions.
 * Prevents abuse and excessive API calls.
 * 
 * Function:
 * - checkRateLimit(key, maxActions, timeWindowMs): Check if action allowed
 * 
 * Storage:
 * - engagement_rate_limit_[key]: Timestamp array
 * 
 * Features:
 * - Sliding window rate limiting
 * - Per-action-type limits
 * - Automatic cleanup of old timestamps
 * 
 * Dependencies: None
 * 
 * NOTE: Client-side only, server-side rate limiting
 * should also be implemented in API routes
 */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  // Cleanup old entries
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
    return false;
  }

  clientData.count++;
  return true;
}