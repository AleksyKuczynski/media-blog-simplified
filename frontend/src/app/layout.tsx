// src/app/layout.tsx
import { Jost, Literata, Yeseva_One } from 'next/font/google'
import './globals.scss'
import { DEFAULT_LANG } from '@/main/lib/constants/constants'
import ConsentModeScript from '@/main/components/Analytics/ConsentModeScript'
import YandexMetrikaScript from '@/main/components/Analytics/YandexMetrikaScript'
import YandexMetrikaNoScript from '@/main/components/Analytics/YandexMetrikaNoScript'
import GoogleAnalyticsScript from '@/main/components/Analytics/GoogleAnalyticsScript'
import GoogleAnalyticsNoScript from '@/main/components/Analytics/GoogleAnalyticsNoScript'
import ConsentBanner from '@/main/components/Analytics/ConsentBanner'
import ScrollRestorationClient from '@/main/components/ScrollRestorationClient' // Changed import
import { dictionary } from '@/main/lib/dictionary';

const fontSans = Jost({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const fontSerif = Literata({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
})

const fontDisplay = Yeseva_One({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  display: 'swap',
})

const consentDictionary = dictionary.consent

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
      lang={DEFAULT_LANG} 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable}`}
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