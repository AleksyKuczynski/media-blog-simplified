// src/main/components/Analytics/YandexMetrika.tsx

'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface YandexMetrikaProps {
  counterId: string;
}

// Extend window object for Yandex Metrika
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
 * Yandex.Metrika Analytics Component
 * 
 * Usage:
 * 1. Add NEXT_PUBLIC_YANDEX_METRIKA_ID to .env.local
 * 2. Add this component to your root layout
 */
export default function YandexMetrika({ counterId }: YandexMetrikaProps) {
  // Validate counter ID
  if (!counterId || !/^\d+$/.test(counterId)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('YandexMetrika: Invalid or missing counter ID');
    }
    return null;
  }

  const counterIdNumber = parseInt(counterId, 10);

  useEffect(() => {
    // Initialize Yandex Metrika after mount
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(counterIdNumber, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        trackHash: true,
      });
    }
  }, [counterIdNumber]);

  return (
    <>
      {/* Yandex.Metrika counter */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${counterIdNumber}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              trackHash:true
            });
          `,
        }}
      />
      
      {/* Noscript fallback */}
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${counterIdNumber}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

/**
 * Helper function to track custom events
 * 
 * Usage:
 * import { trackYandexEvent } from '@/main/components/Analytics/YandexMetrika';
 * trackYandexEvent('button_click', { button_name: 'subscribe' });
 */
export function trackYandexEvent(
  eventName: string,
  params?: Record<string, any>
) {
  const counterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  
  if (typeof window !== 'undefined' && window.ym && counterId) {
    window.ym(parseInt(counterId, 10), 'reachGoal', eventName, params);
  }
}