// src/app/layout.tsx

import '@/app/globals.scss';
import { fontSans, fontSerif, fontDisplay, fontCustom } from '@/app/fonts/fonts';
import YandexMetrikaScript from '@/main/components/Analytics/YandexMetrikaScript';
import YandexMetrikaNoScript from '@/main/components/Analytics/YandexMetrikaNoScript';
import GoogleAnalyticsScript from '@/main/components/Analytics/GoogleAnalyticsScript';
import GoogleAnalyticsNoScript from '@/main/components/Analytics/GoogleAnalyticsNoScript';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Analytics configuration from environment variables
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html 
      lang="ru" 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <head>
        {/* Yandex.Metrika script - Russian market primary analytics */}
        {yandexMetrikaId && <YandexMetrikaScript counterId={yandexMetrikaId} />}
        
        {/* Google Analytics 4 - Global analytics and international audience */}
        {googleAnalyticsId && <GoogleAnalyticsScript measurementId={googleAnalyticsId} />}
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Analytics noscript fallbacks - required in body */}
        {yandexMetrikaId && <YandexMetrikaNoScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsNoScript measurementId={googleAnalyticsId} />}
        
        {children}
      </body>
    </html>
  );
}