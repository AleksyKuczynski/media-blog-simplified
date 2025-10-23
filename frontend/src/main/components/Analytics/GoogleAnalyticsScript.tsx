// src/main/components/Analytics/GoogleAnalyticsScript.tsx

interface GoogleAnalyticsScriptProps {
  measurementId: string;
}

/**
 * Google Analytics 4 Script Component (Server Component)
 * Place in <head> for earliest initialization
 * 
 * This component loads Google Analytics 4 (gtag.js) with optimal configuration
 * for Next.js App Router SSR. Must be paired with GoogleAnalyticsNoScript in <body>
 * if fallback tracking is needed.
 * 
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */
export default function GoogleAnalyticsScript({ measurementId }: GoogleAnalyticsScriptProps) {
  // Validate measurement ID format (G-XXXXXXXXXX)
  const isValidMeasurementId = measurementId && /^G-[A-Z0-9]+$/.test(measurementId);
  
  if (!isValidMeasurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('GoogleAnalyticsScript: Invalid or missing measurement ID');
    }
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js - async loading */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      
      {/* Google Analytics initialization */}
      <script
        id="google-analytics-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true,
              allow_google_signals: true,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}