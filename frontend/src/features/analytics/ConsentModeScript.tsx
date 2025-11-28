// src/main/components/Analytics/ConsentModeScript.tsx

/**
 * Consent Mode Initialization Script (Server Component)
 * 
 * CRITICAL: This must load BEFORE any analytics scripts
 * Place in <head> before YandexMetrikaScript and GoogleAnalyticsScript
 * 
 * Initializes Google Consent Mode v2 with default 'denied' state
 * for all consent types except necessary cookies.
 */
export default function ConsentModeScript() {
  return (
    <script
      id="consent-mode-init"
      dangerouslySetInnerHTML={{
        __html: `
          // Initialize consent mode before any analytics load
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Set default consent state (all denied except necessary)
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'granted',
            'personalization_storage': 'denied',
            'security_storage': 'granted',
            'wait_for_update': 500
          });
          
          // Enable ads data redaction
          gtag('set', 'ads_data_redaction', true);
          
          // Enable URL passthrough for conversion tracking
          gtag('set', 'url_passthrough', true);
          
          // Check for saved consent and update immediately
          try {
            const savedConsent = localStorage.getItem('user_consent_preferences');
            if (savedConsent) {
              const prefs = JSON.parse(savedConsent);
              
              // Update consent based on saved preferences
              gtag('consent', 'update', {
                'ad_storage': prefs.marketing ? 'granted' : 'denied',
                'ad_user_data': prefs.marketing ? 'granted' : 'denied',
                'ad_personalization': prefs.marketing ? 'granted' : 'denied',
                'analytics_storage': prefs.analytics ? 'granted' : 'denied',
                'personalization_storage': prefs.preferences ? 'granted' : 'denied'
              });
            }
          } catch (e) {
            // Ignore errors in consent loading
          }
        `,
      }}
    />
  );
}