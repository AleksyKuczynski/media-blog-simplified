// frontend/src/main/lib/engagement/types.ts
// PHASE 1 - UPDATED: Added last_updated field for timestamp-based reconciliation
/**
 * Engagement Types
 * 
 * Centralized type definitions for the engagement system
 */

// ===================================================================
// CORE DATA TYPES
// ===================================================================

export interface EngagementData {
  slug: string;
  views: number;
  likes: number;
  shares: number;
  last_updated?: string | null; // NEW: ISO timestamp from Directus date_updated field
}

export interface EngagementResponse {
  success: boolean;
  data: EngagementData;
  action?: EngagementAction;
  viewTracked?: boolean; // Flag to indicate if view was tracked in this request
}

export interface EngagementError {
  error: string;
  message?: string;
}

export type EngagementAction = 'view' | 'like' | 'unlike' | 'share';

// ===================================================================
// UI STATE TYPES
// ===================================================================

export interface EngagementState {
  data: EngagementData;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

export interface LikeState {
  isLiked: boolean;
  isProcessing: boolean;
}

export interface ViewTrackingState {
  isTracking: boolean;
  hasTracked: boolean;
}

// ===================================================================
// SHARE TYPES
// ===================================================================

export type SharePlatform = 'copy' | 'facebook' | 'twitter' | 'telegram' | 'whatsapp' | 'instagram';

export interface ShareConfig {
  url: string;
  title: string;
}

// ===================================================================
// RETRY TYPES
// ===================================================================

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: any) => boolean;
}