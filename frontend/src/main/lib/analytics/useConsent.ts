// src/main/lib/analytics/useConsent.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ConsentPreferences,
  ConsentState,
  loadConsentPreferences,
  saveConsentPreferences,
  preferencesToConsentState,
  updateConsentMode,
} from './consent';

export interface UseConsentReturn {
  preferences: ConsentPreferences;
  consentState: ConsentState;
  hasChoice: boolean;
  isLoading: boolean;
  
  // Actions
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (preferences: Partial<ConsentPreferences>) => void;
  savePreferences: () => void;
}

/**
 * Hook for managing cookie consent in React components
 * 
 * @example
 * ```tsx
 * function ConsentBanner() {
 *   const { hasChoice, acceptAll, rejectAll } = useConsent();
 *   
 *   if (hasChoice) return null;
 *   
 *   return (
 *     <div>
 *       <button onClick={acceptAll}>Accept All</button>
 *       <button onClick={rejectAll}>Reject All</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useConsent(): UseConsentReturn {
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  
  const [hasChoice, setHasChoice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preferences on mount
  useEffect(() => {
    const savedPreferences = loadConsentPreferences();
    
    if (savedPreferences) {
      setPreferences(savedPreferences);
      setHasChoice(true);
      
      // Update consent mode with saved preferences
      const state = preferencesToConsentState(savedPreferences);
      updateConsentMode(state);
    } else {
      setHasChoice(false);
    }
    
    setIsLoading(false);
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    setPreferences(allAccepted);
    saveConsentPreferences(allAccepted);
    setHasChoice(true);
    
    const state = preferencesToConsentState(allAccepted);
    updateConsentMode(state);
  }, []);

  // Reject all optional cookies (keep only necessary)
  const rejectAll = useCallback(() => {
    const onlyNecessary: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    
    setPreferences(onlyNecessary);
    saveConsentPreferences(onlyNecessary);
    setHasChoice(true);
    
    const state = preferencesToConsentState(onlyNecessary);
    updateConsentMode(state);
  }, []);

  // Update specific preferences
  const updatePreferences = useCallback((updates: Partial<ConsentPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
      necessary: true, // Always keep necessary enabled
    }));
  }, []);

  // Save current preferences
  const savePreferences = useCallback(() => {
    saveConsentPreferences(preferences);
    setHasChoice(true);
    
    const state = preferencesToConsentState(preferences);
    updateConsentMode(state);
  }, [preferences]);

  // Calculate current consent state
  const consentState = preferencesToConsentState(preferences);

  return {
    preferences,
    consentState,
    hasChoice,
    isLoading,
    acceptAll,
    rejectAll,
    updatePreferences,
    savePreferences,
  };
}