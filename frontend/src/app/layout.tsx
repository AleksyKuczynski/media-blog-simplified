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
import ScrollRestoration from '@/main/lib/hooks/useScrollRestoration'

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

// FIXED: Comprehensive Russian consent dictionary
const consentDictionary = {
  title: 'Мы используем файлы cookie',
  description: 'Мы используем файлы cookie для улучшения вашего опыта, анализа трафика и персонализации контента. Вы можете принять все или настроить свои предпочтения.',
  acceptAll: 'Принять все',
  rejectAll: 'Отклонить все',
  customize: 'Настроить',
  save: 'Сохранить настройки',
  necessary: 'Необходимые',
  analytics: 'Аналитика',
  marketing: 'Маркетинг',
  preferences: 'Предпочтения',
  necessaryDescription: 'Эти файлы cookie обеспечивают базовую функциональность и безопасность.',
  analyticsDescription: 'Помогают нам понять, как посетители взаимодействуют с сайтом, собирая анонимную информацию.',
  marketingDescription: 'Используются для показа релевантной рекламы и измерения эффективности рекламных кампаний.',
  preferencesDescription: 'Позволяют сайту запоминать ваши предпочтения, такие как язык или регион.',
  privacyPolicy: 'Политика конфиденциальности',
};

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
        
        {/* ADDED: Scroll Restoration - fixes back navigation scroll position issues */}
        <ScrollRestoration />
        
        {children}
      </body>
    </html>
  );
}