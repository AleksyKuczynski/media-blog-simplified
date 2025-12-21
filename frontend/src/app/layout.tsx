// src/app/layout.tsx
import './globals.scss'
import { DEFAULT_LANG } from '@/config/constants/constants'
import ConsentModeScript from '@/features/analytics/ConsentModeScript'
import YandexMetrikaScript from '@/features/analytics/YandexMetrikaScript'
import YandexMetrikaNoScript from '@/features/analytics/YandexMetrikaNoScript'
import GoogleAnalyticsScript from '@/features/analytics/GoogleAnalyticsScript'
import GoogleAnalyticsNoScript from '@/features/analytics/GoogleAnalyticsNoScript'
import ConsentBanner from '@/features/analytics/ConsentBanner'
import ScrollRestorationClient from '@/features/navigation/ScrollRestorationClient' // Changed import
import { dictionary, Lang } from '@/config/i18n';
import { fontCustom, fontDisplay, fontSans, fontSerif } from './fonts/fonts'

const consentDictionary = dictionary.consent

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;

  // Analytics configuration from environment variables
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html 
      lang={lang} 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <head>
        {/* CRITICAL: Consent Mode must load FIRST, before any analytics */}
        <ConsentModeScript />
        
        {/* Yandex.Metrika script - Russian market primary analytics */}
        {yandexMetrikaId && <YandexMetrikaScript counterId={yandexMetrikaId} />}
        
        {/* Google Analytics 4 - Global analytics with Consent Mode v2 */}
        {googleAnalyticsId && <GoogleAnalyticsScript measurementId={googleAnalyticsId} />}
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Analytics noscript fallbacks - required in body */}
        {yandexMetrikaId && <YandexMetrikaNoScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsNoScript measurementId={googleAnalyticsId} />}
        
        {/* Cookie Consent Banner - shows if user hasn't made choice */}
        <ConsentBanner dictionary={consentDictionary} />
        
        {/* FIXED: Client-side wrapper ensures proper hydration */}
        <ScrollRestorationClient />
        
        {children}
      </body>
    </html>
  );
}