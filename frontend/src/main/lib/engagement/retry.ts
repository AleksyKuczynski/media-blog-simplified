// frontend/src/main/lib/engagement/retry.ts
/**
 * Retry Logic with Exponential Backoff
 * 
 * Handles transient failures with intelligent retry strategy
 */

import type { RetryOptions } from './types';

/**
 * Exponential backoff retry utility
 * 
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Promise with function result
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt or if we shouldn't retry this error
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelayMs * Math.pow(2, attempt),
        maxDelayMs
      );

      console.log(`[Retry] Attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Determine if an error should be retried
 * 
 * @param error - Error object or message
 * @returns True if error is retryable
 */
export function shouldRetryError(error: any): boolean {
  const errorMessage = error?.message || '';
  
  // Retry on rate limits (with backoff)
  if (errorMessage.includes('Rate limit')) {
    return true;
  }
  
  // Retry on network errors
  if (errorMessage.includes('fetch failed') || errorMessage.includes('Network')) {
    return true;
  }
  
  // Don't retry on client errors (400, 401, 403, 404)
  if (errorMessage.includes('400') || 
      errorMessage.includes('401') || 
      errorMessage.includes('403') || 
      errorMessage.includes('404')) {
    return false;
  }
  
  // Retry on server errors (500, 502, 503, 504)
  return true;
}