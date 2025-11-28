// src/main/lib/analytics/consent.ts

/**
 * Google Consent Mode v2 Implementation
 * Required for EEA users to comply with GDPR and ePrivacy Directive
 * 
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */

export type ConsentStatus = 'granted' | 'denied';

export interface ConsentState {
  // Google Consent Mode v2 required parameters
  ad_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
  analytics_storage: ConsentStatus;
  
  // Additional consent parameters
  functionality_storage: ConsentStatus;
  personalization_storage: ConsentStatus;
  security_storage: ConsentStatus;
  
  // Metadata
  timestamp: number;
  region?: string;
}

export interface ConsentPreferences {
  necessary: boolean; // Always true, required for site functionality
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CONSENT_STORAGE_KEY = 'user_consent_preferences';
const CONSENT_TIMESTAMP_KEY = 'user_consent_timestamp';

/**
 * Get default consent state (all denied except necessary)
 * This is the initial state before user interaction
 */
export function getDefaultConsentState(): ConsentState {
  return {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted', // Required for site to work
    personalization_storage: 'denied',
    security_storage: 'granted', // Required for security
    timestamp: Date.now(),
  };
}

/**
 * Convert user preferences to consent state
 */
export function preferencesToConsentState(
  preferences: ConsentPreferences
): ConsentState {
  return {
    // Marketing = Ads
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',
    
    // Analytics
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    
    // Functionality (always granted)
    functionality_storage: 'granted',
    security_storage: 'granted',
    
    // Preferences
    personalization_storage: preferences.preferences ? 'granted' : 'denied',
    
    timestamp: Date.now(),
  };
}

/**
 * Convert consent state to user preferences
 */
export function consentStateToPreferences(
  state: ConsentState
): ConsentPreferences {
  return {
    necessary: true, // Always true
    analytics: state.analytics_storage === 'granted',
    marketing: state.ad_storage === 'granted',
    preferences: state.personalization_storage === 'granted',
  };
}

/**
 * Initialize Google Consent Mode with default denied state
 * Must be called BEFORE gtag/analytics scripts load
 */
export function initializeConsentMode(): void {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if not exists
  window.dataLayer = window.dataLayer || [];
  
  function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  }

  // Set default consent state (all denied except necessary)
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500, // Wait 500ms for consent before loading
  });

  // Set ads data redaction
  gtag('set', 'ads_data_redaction', true);
  
  // Set URL passthrough for conversion linker
  gtag('set', 'url_passthrough', true);
}

/**
 * Update consent mode with user's choices
 */
export function updateConsentMode(state: ConsentState): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  
  function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  }

  // Update Google consent
  gtag('consent', 'update', {
    ad_storage: state.ad_storage,
    ad_user_data: state.ad_user_data,
    ad_personalization: state.ad_personalization,
    analytics_storage: state.analytics_storage,
    functionality_storage: state.functionality_storage,
    personalization_storage: state.personalization_storage,
    security_storage: state.security_storage,
  });

  // Also notify Yandex Metrica about consent changes
  if (window.ym && process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) {
    const counterId = parseInt(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID, 10);
    
    // Enable/disable Yandex features based on consent
    const params: Record<string, boolean> = {};
    
    if (state.analytics_storage === 'denied') {
      params.accurateTrackBounce = false;
      params.clickmap = false;
      params.trackLinks = false;
      params.webvisor = false;
    }
    
    window.ym(counterId, 'params', params);
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentPreferences(
  preferences: ConsentPreferences
): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify(preferences)
    );
    localStorage.setItem(
      CONSENT_TIMESTAMP_KEY,
      Date.now().toString()
    );
  } catch (error) {
    console.error('Failed to save consent preferences:', error);
  }
}

/**
 * Load consent preferences from localStorage
 */
export function loadConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
    
    if (!stored || !timestamp) return null;

    // Check if consent is expired (6 months)
    const consentAge = Date.now() - parseInt(timestamp, 10);
    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
    
    if (consentAge > sixMonths) {
      clearConsentPreferences();
      return null;
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load consent preferences:', error);
    return null;
  }
}

/**
 * Clear consent preferences
 */
export function clearConsentPreferences(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear consent preferences:', error);
  }
}

/**
 * Check if user has made a consent choice
 */
export function hasConsentChoice(): boolean {
  return loadConsentPreferences() !== null;
}

/**
 * Get current consent state (from storage or default)
 */
export function getCurrentConsentState(): ConsentState {
  const preferences = loadConsentPreferences();
  
  if (preferences) {
    return preferencesToConsentState(preferences);
  }
  
  return getDefaultConsentState();
}

// TypeScript declarations for global window objects
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: {
      (...args: any[]): void;  // Flexible catch-all
      (command: 'consent', action: 'default' | 'update', params: Record<string, any>): void;
      (command: 'set', key: string, value: any): void;
      (command: 'config', targetId: string, config?: Record<string, any>): void;
      (command: 'event', eventName: string, params?: Record<string, any>): void;
      };
    ym?: (counterId: number, action: string, ...params: any[]) => void;
  }
}