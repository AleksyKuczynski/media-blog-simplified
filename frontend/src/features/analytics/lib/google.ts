// src/main/lib/analytics/google.ts

/**
 * Google Analytics 4 (gtag.js) client-side helper functions
 * Use these in client components to track events and conversions
 * 
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 */

/**
 * Track custom events in Google Analytics 4
 * 
 * @example
 * ```tsx
 * import { trackGAEvent } from '@/main/lib/analytics/google';
 * 
 * function SubscribeButton() {
 *   const handleClick = () => {
 *     trackGAEvent('subscribe', {
 *       location: 'header',
 *       plan_type: 'premium'
 *     });
 *   };
 *   return <button onClick={handleClick}>Subscribe</button>;
 * }
 * ```
 */
export function trackGAEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (typeof window !== 'undefined' && window.gtag && measurementId) {
    try {
      window.gtag('event', eventName, {
        send_to: measurementId,
        ...params,
      });
    } catch (error) {
      console.error('Google Analytics trackEvent error:', error);
    }
  }
}

/**
 * Track page views manually (useful for client-side navigation)
 * 
 * @example
 * ```tsx
 * import { trackGAPageView } from '@/main/lib/analytics/google';
 * 
 * function ArticlePage() {
 *   useEffect(() => {
 *     trackGAPageView({
 *       page_path: window.location.pathname,
 *       page_title: document.title
 *     });
 *   }, []);
 *   return <article>...</article>;
 * }
 * ```
 */
export function trackGAPageView(params?: {
  page_path?: string;
  page_title?: string;
  page_location?: string;
}): void {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (typeof window !== 'undefined' && window.gtag && measurementId) {
    try {
      window.gtag('config', measurementId, {
        page_path: params?.page_path || window.location.pathname,
        page_title: params?.page_title || document.title,
        page_location: params?.page_location || window.location.href,
      });
    } catch (error) {
      console.error('Google Analytics trackPageView error:', error);
    }
  }
}

/**
 * Track outbound link clicks
 * 
 * @example
 * ```tsx
 * import { trackGAOutboundLink } from '@/main/lib/analytics/google';
 * 
 * function ExternalLink({ href, children }) {
 *   return (
 *     <a 
 *       href={href}
 *       onClick={() => trackGAOutboundLink(href)}
 *       target="_blank"
 *       rel="noopener noreferrer"
 *     >
 *       {children}
 *     </a>
 *   );
 * }
 * ```
 */
export function trackGAOutboundLink(url: string, label?: string): void {
  trackGAEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    link_url: url,
  });
}

/**
 * Track file downloads
 * 
 * @example
 * ```tsx
 * import { trackGAFileDownload } from '@/main/lib/analytics/google';
 * 
 * function DownloadButton({ fileUrl, fileName }) {
 *   return (
 *     <a 
 *       href={fileUrl}
 *       onClick={() => trackGAFileDownload(fileUrl, fileName)}
 *       download={fileName}
 *     >
 *       Download {fileName}
 *     </a>
 *   );
 * }
 * ```
 */
export function trackGAFileDownload(url: string, fileName?: string): void {
  trackGAEvent('file_download', {
    file_name: fileName || url.split('/').pop(),
    file_url: url,
    link_text: fileName,
  });
}

/**
 * Track search queries
 * 
 * @example
 * ```tsx
 * import { trackGASearch } from '@/main/lib/analytics/google';
 * 
 * function SearchBar() {
 *   const handleSearch = (query: string) => {
 *     trackGASearch(query);
 *     // perform search...
 *   };
 *   return <input onSubmit={e => handleSearch(e.target.value)} />;
 * }
 * ```
 */
export function trackGASearch(searchTerm: string, resultsCount?: number): void {
  trackGAEvent('search', {
    search_term: searchTerm,
    ...(resultsCount !== undefined && { results_count: resultsCount }),
  });
}

/**
 * Track content engagement (e.g., article read time, scroll depth)
 * 
 * @example
 * ```tsx
 * import { trackGAEngagement } from '@/main/lib/analytics/google';
 * 
 * function Article() {
 *   useEffect(() => {
 *     const timer = setTimeout(() => {
 *       trackGAEngagement('article_read_time', 30);
 *     }, 30000);
 *     return () => clearTimeout(timer);
 *   }, []);
 *   return <article>...</article>;
 * }
 * ```
 */
export function trackGAEngagement(
  engagementType: 'scroll' | 'time_on_page' | 'article_read_time',
  value: number,
  metadata?: Record<string, any>
): void {
  trackGAEvent('engagement', {
    engagement_type: engagementType,
    value,
    ...metadata,
  });
}

/**
 * Set user properties for segmentation
 * 
 * @example
 * ```tsx
 * import { setGAUserProperties } from '@/main/lib/analytics/google';
 * 
 * function UserProfile({ user }) {
 *   useEffect(() => {
 *     setGAUserProperties({
 *       user_type: user.isPremium ? 'premium' : 'free',
 *       preferred_language: 'ru'
 *     });
 *   }, [user]);
 *   return <div>...</div>;
 * }
 * ```
 */
export function setGAUserProperties(properties: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('set', 'user_properties', properties);
    } catch (error) {
      console.error('Google Analytics setUserProperties error:', error);
    }
  }
}

/**
 * Track exceptions/errors
 * 
 * @example
 * ```tsx
 * import { trackGAException } from '@/main/lib/analytics/google';
 * 
 * try {
 *   // some code
 * } catch (error) {
 *   trackGAException(error.message, false);
 * }
 * ```
 */
export function trackGAException(description: string, fatal = false): void {
  trackGAEvent('exception', {
    description,
    fatal,
  });
}

/**
 * Track social interactions
 * 
 * @example
 * ```tsx
 * import { trackGASocialInteraction } from '@/main/lib/analytics/google';
 * 
 * function ShareButton({ network, url }) {
 *   return (
 *     <button onClick={() => trackGASocialInteraction(network, 'share', url)}>
 *       Share on {network}
 *     </button>
 *   );
 * }
 * ```
 */
export function trackGASocialInteraction(
  network: string,
  action: string,
  target?: string
): void {
  trackGAEvent('share', {
    method: network,
    content_type: action,
    item_id: target,
  });
}