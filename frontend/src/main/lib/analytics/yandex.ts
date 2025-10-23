// src/main/lib/analytics/yandex.ts

/**
 * Yandex.Metrika client-side helper functions
 * Use these in client components to track events and page views
 */

declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: string,
      ...params: any[]
    ) => void;
  }
}

/**
 * Track custom events in Yandex.Metrika
 * 
 * @example
 * ```tsx
 * import { trackYandexEvent } from '@/main/lib/analytics/yandex';
 * 
 * function SubscribeButton() {
 *   const handleClick = () => {
 *     trackYandexEvent('subscribe_click', { location: 'header' });
 *   };
 *   return <button onClick={handleClick}>Subscribe</button>;
 * }
 * ```
 */
export function trackYandexEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    try {
      window.ym(parseInt(counterId, 10), 'reachGoal', eventName, params);
    } catch (error) {
      console.error('Yandex.Metrika trackEvent error:', error);
    }
  }
}

/**
 * Track page views manually (useful for client-side navigation)
 * 
 * @example
 * ```tsx
 * import { trackYandexPageView } from '@/main/lib/analytics/yandex';
 * 
 * function ArticlePage() {
 *   useEffect(() => {
 *     trackYandexPageView(window.location.pathname);
 *   }, []);
 *   return <article>...</article>;
 * }
 * ```
 */
export function trackYandexPageView(
  url: string,
  options?: {
    title?: string;
    referer?: string;
    params?: Record<string, any>;
  }
): void {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    try {
      window.ym(parseInt(counterId, 10), 'hit', url, options);
    } catch (error) {
      console.error('Yandex.Metrika trackPageView error:', error);
    }
  }
}

/**
 * Track external link clicks
 * 
 * @example
 * ```tsx
 * import { trackYandexExternalLink } from '@/main/lib/analytics/yandex';
 * 
 * function ExternalLink({ href, children }) {
 *   return (
 *     <a 
 *       href={href} 
 *       onClick={() => trackYandexExternalLink(href)}
 *       target="_blank"
 *       rel="noopener noreferrer"
 *     >
 *       {children}
 *     </a>
 *   );
 * }
 * ```
 */
export function trackYandexExternalLink(url: string): void {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    try {
      window.ym(parseInt(counterId, 10), 'extLink', url);
    } catch (error) {
      console.error('Yandex.Metrika trackExternalLink error:', error);
    }
  }
}

/**
 * Track file downloads
 * 
 * @example
 * ```tsx
 * import { trackYandexFileDownload } from '@/main/lib/analytics/yandex';
 * 
 * function DownloadButton({ fileUrl, fileName }) {
 *   return (
 *     <a 
 *       href={fileUrl}
 *       onClick={() => trackYandexFileDownload(fileUrl)}
 *       download={fileName}
 *     >
 *       Download {fileName}
 *     </a>
 *   );
 * }
 * ```
 */
export function trackYandexFileDownload(url: string): void {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    try {
      window.ym(parseInt(counterId, 10), 'file', url);
    } catch (error) {
      console.error('Yandex.Metrika trackFileDownload error:', error);
    }
  }
}

/**
 * Update user parameters for segmentation
 * 
 * @example
 * ```tsx
 * import { setYandexUserParams } from '@/main/lib/analytics/yandex';
 * 
 * function UserProfile({ user }) {
 *   useEffect(() => {
 *     setYandexUserParams({
 *       UserID: user.id,
 *       UserType: user.isPremium ? 'premium' : 'free'
 *     });
 *   }, [user]);
 *   return <div>...</div>;
 * }
 * ```
 */
export function setYandexUserParams(params: Record<string, any>): void {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    try {
      window.ym(parseInt(counterId, 10), 'userParams', params);
    } catch (error) {
      console.error('Yandex.Metrika setUserParams error:', error);
    }
  }
}