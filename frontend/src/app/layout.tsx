// src/app/layout.tsx
import './globals.scss'
import { DEFAULT_LANG, SUPPORTED_LANGUAGES } from '@/config/constants/constants'
import ConsentModeScript from '@/features/analytics/ConsentModeScript'
import YandexMetrikaScript from '@/features/analytics/YandexMetrikaScript'
import YandexMetrikaNoScript from '@/features/analytics/YandexMetrikaNoScript'
import GoogleAnalyticsScript from '@/features/analytics/GoogleAnalyticsScript'
import GoogleAnalyticsNoScript from '@/features/analytics/GoogleAnalyticsNoScript'
import ConsentBanner from '@/features/analytics/ConsentBanner'
import ScrollRestorationClient from '@/features/navigation/ScrollRestorationClient'
import { dictionary, Lang } from '@/config/i18n'
import { fontCustom, fontDisplay, fontSans, fontSerif } from './fonts/fonts'
import { headers } from 'next/headers'
import { Metadata } from 'next'

const consentDictionary = dictionary.consent

// Add metadata export
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eventforme.com'),
}

async function detectLanguageFromPath(): Promise<Lang> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('referer') || '';
  
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
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html 
      lang={lang} 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <head>
        <ConsentModeScript />
        {yandexMetrikaId && <YandexMetrikaScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsScript measurementId={googleAnalyticsId} />}
        
        {/* Add hreflang links */}
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="ru" href="/ru" />
        <link rel="alternate" hrefLang="x-default" href={`/${DEFAULT_LANG}`} />
      </head>
      <body className="flex flex-col bg-sf min-h-screen">
        {yandexMetrikaId && <YandexMetrikaNoScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsNoScript measurementId={googleAnalyticsId} />}
        <ConsentBanner dictionary={consentDictionary} />
        <ScrollRestorationClient />
        {children}
      </body>
    </html>
  );
}