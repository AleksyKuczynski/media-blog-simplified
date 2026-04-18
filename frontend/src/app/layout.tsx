// src/app/layout.tsx
import './globals.scss'
import { DEFAULT_LANG } from '@/config/constants/constants'
import ConsentModeScript from '@/features/analytics/ConsentModeScript'
import YandexMetrikaScript from '@/features/analytics/YandexMetrikaScript'
import YandexMetrikaNoScript from '@/features/analytics/YandexMetrikaNoScript'
import GoogleAnalyticsScript from '@/features/analytics/GoogleAnalyticsScript'
import GoogleAnalyticsNoScript from '@/features/analytics/GoogleAnalyticsNoScript'
import ScrollRestorationClient from '@/features/navigation/ScrollRestorationClient'
import { fontDisplay, fontSans, fontSerif } from './fonts/fonts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://event4me.vip'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html 
      lang={DEFAULT_LANG} 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable}`}
    >
      <head>
        <ConsentModeScript />
        {yandexMetrikaId && <YandexMetrikaScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsScript measurementId={googleAnalyticsId} />}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body className="flex flex-col bg-sf min-h-screen">
        {yandexMetrikaId && <YandexMetrikaNoScript counterId={yandexMetrikaId} />}
        {googleAnalyticsId && <GoogleAnalyticsNoScript measurementId={googleAnalyticsId} />}
        <ScrollRestorationClient />
        {children}
      </body>
    </html>
  );
}