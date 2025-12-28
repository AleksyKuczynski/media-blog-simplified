// src/app/layout.tsx
import './globals.scss'
import { DEFAULT_LANG, SUPPORTED_LANGUAGES } from '@/config/constants/constants'
import ConsentModeScript from '@/features/analytics/ConsentModeScript'
import YandexMetrikaScript from '@/features/analytics/YandexMetrikaScript'
import YandexMetrikaNoScript from '@/features/analytics/YandexMetrikaNoScript'
import GoogleAnalyticsScript from '@/features/analytics/GoogleAnalyticsScript'
import GoogleAnalyticsNoScript from '@/features/analytics/GoogleAnalyticsNoScript'
import ConsentBanner from '@/features/analytics/ConsentBanner'
import ScrollRestorationClient from '@/features/navigation/ScrollRestorationClient' // Changed import
import { dictionary, Lang } from '@/config/i18n';
import { fontCustom, fontDisplay, fontSans, fontSerif } from './fonts/fonts'
import { headers } from 'next/headers'

const consentDictionary = dictionary.consent


async function detectLanguageFromPath(): Promise<Lang> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';
  
  // Extract language from pathname (e.g., /ru/articles -> ru)
  const langMatch = pathname.match(/\/([a-z]{2})(\/|$)/);
  if (langMatch && SUPPORTED_LANGUAGES.includes(langMatch[1] as Lang)) {
    return langMatch[1] as Lang;
  }
  
  return DEFAULT_LANG;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await detectLanguageFromPath();

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
      <body className="flex flex-col bg-sf min-h-screen">
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