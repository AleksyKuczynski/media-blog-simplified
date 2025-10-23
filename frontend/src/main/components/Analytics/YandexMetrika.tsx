// src/main/components/Analytics/YandexMetrika.tsx

interface YandexMetrikaProps {
  counterId: string;
}

/**
 * Yandex.Metrika Analytics Component (Server Component)
 * Optimized for Next.js App Router with immediate loading
 * 
 * This component injects the Yandex.Metrika script directly into the HTML
 * during server-side rendering, ensuring the earliest possible initialization.
 * 
 * Usage:
 * Add to root layout's <head> or <body>
 */
export default function YandexMetrika({ counterId }: YandexMetrikaProps) {
  // Validate counter ID
  const isValidCounterId = counterId && /^\d+$/.test(counterId);
  
  if (!isValidCounterId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('YandexMetrika: Invalid or missing counter ID');
    }
    return null;
  }

  const counterIdNumber = parseInt(counterId, 10);

  return (
    <>
      {/* Yandex.Metrika counter - inline for immediate execution */}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${counterIdNumber}', 'ym');
            
            ym(${counterIdNumber}, 'init', {
              ssr: true,
              webvisor: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              trackHash: true,
              ecommerce: "dataLayer"
            });
          `,
        }}
      />
      
      {/* Noscript fallback */}
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
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