// src/main/components/Analytics/ConsentBanner.tsx
'use client';

import { useConsent } from '@/main/lib/analytics/useConsent';
import { useState } from 'react';

interface ConsentBannerProps {
  dictionary: {
    title: string;
    description: string;
    acceptAll: string;
    rejectAll: string;
    customize: string;
    save: string;
    necessary: string;
    analytics: string;
    marketing: string;
    preferences: string;
    necessaryDescription: string;
    analyticsDescription: string;
    marketingDescription: string;
    preferencesDescription: string;
    privacyPolicy: string;
  };
}

/**
 * Cookie Consent Banner Component
 * Implements Google Consent Mode v2 for EEA compliance
 * 
 * Usage: Add to root layout after body opening tag
 */
export default function ConsentBanner({ dictionary }: ConsentBannerProps) {
  const {
    preferences,
    hasChoice,
    isLoading,
    acceptAll,
    rejectAll,
    updatePreferences,
    savePreferences,
  } = useConsent();

  const [showDetails, setShowDetails] = useState(false);

  // Don't show banner if user already made a choice or still loading
  if (isLoading || hasChoice) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        aria-hidden="true"
      />

      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 dark:border-gray-700"
        role="dialog"
        aria-labelledby="consent-title"
        aria-describedby="consent-description"
        aria-modal="true"
      >
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Simple view */}
          {!showDetails ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Text content */}
              <div className="flex-1">
                <h2 
                  id="consent-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                >
                  {dictionary.title}
                </h2>
                <p 
                  id="consent-description"
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  {dictionary.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {dictionary.rejectAll}
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white underline"
                >
                  {dictionary.customize}
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  {dictionary.acceptAll}
                </button>
              </div>
            </div>
          ) : (
            /* Detailed preferences view */
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {dictionary.customize}
              </h2>

              {/* Necessary cookies (always enabled) */}
              <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {dictionary.necessary}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded">
                      Всегда активно
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {dictionary.necessaryDescription}
                  </p>
                </div>
              </div>

              {/* Analytics cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {dictionary.analytics}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {dictionary.analyticsDescription}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => updatePreferences({ analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Marketing cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {dictionary.marketing}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {dictionary.marketingDescription}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => updatePreferences({ marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Preferences cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {dictionary.preferences}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {dictionary.preferencesDescription}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.preferences}
                    onChange={(e) => updatePreferences({ preferences: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  ← Назад
                </button>
                <div className="flex-1" />
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {dictionary.rejectAll}
                </button>
                <button
                  onClick={savePreferences}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                >
                  {dictionary.save}
                </button>
              </div>

              {/* Privacy policy link */}
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                <a 
                  href="/ru/privacy-policy" 
                  className="underline hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {dictionary.privacyPolicy}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}