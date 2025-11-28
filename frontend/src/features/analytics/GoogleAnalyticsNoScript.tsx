// src/main/components/Analytics/GoogleAnalyticsNoScript.tsx

interface GoogleAnalyticsNoScriptProps {
  measurementId: string;
}

/**
 * Google Analytics 4 NoScript Component (Server Component)
 * Optional fallback for non-JavaScript environments
 * 
 * Note: GA4 primarily relies on JavaScript, so this is a minimal fallback.
 * Unlike Yandex Metrica, GA4 doesn't have a robust noscript tracking solution.
 * This component can be omitted if your audience has JavaScript enabled.
 * 
 * Place in <body> after opening tag if you choose to use it.
 */
export default function GoogleAnalyticsNoScript({ measurementId }: GoogleAnalyticsNoScriptProps) {
  // Validate measurement ID
  const isValidMeasurementId = measurementId && /^G-[A-Z0-9]+$/.test(measurementId);
  
  if (!isValidMeasurementId) {
    return null;
  }

  return (
    <noscript>
      {/* GA4 doesn't have native noscript tracking like Yandex */}
      {/* This is a placeholder - consider using gtag server-side events via Measurement Protocol instead */}
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${measurementId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Analytics"
      />
    </noscript>
  );
}