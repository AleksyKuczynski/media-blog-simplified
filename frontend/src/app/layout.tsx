// src/app/layout.tsx

import '@/app/globals.scss';
import { fontSans, fontSerif, fontDisplay, fontCustom } from '@/app/fonts/fonts';
import ConsentModeScript from '@/main/components/Analytics/ConsentModeScript';
import YandexMetrikaScript from '@/main/components/Analytics/YandexMetrikaScript';
import YandexMetrikaNoScript from '@/main/components/Analytics/YandexMetrikaNoScript';
import GoogleAnalyticsScript from '@/main/components/Analytics/GoogleAnalyticsScript';
import GoogleAnalyticsNoScript from '@/main/components/Analytics/GoogleAnalyticsNoScript';
import ConsentBanner from '@/main/components/Analytics/ConsentBanner';

// Cookie consent dictionary (can be moved to your dictionary file)
const consentDictionary = {
  title: 'Мы используем файлы cookie',
  description: 'Мы используем файлы cookie для улучшения работы сайта, анализа трафика и персонализации контента. Вы можете настроить свои предпочтения или принять все файлы cookie.',
  acceptAll: 'Принять все',
  rejectAll: 'Только необходимые',
  customize: 'Настроить',
  save: 'Сохранить настройки',
  necessary: 'Необходимые',
  analytics: 'Аналитические',
  marketing: 'Маркетинговые',
  preferences: 'Функциональные',
  necessaryDescription: 'Необходимы для работы сайта. Эти файлы cookie обеспечивают базовую функциональность и безопасность.',
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
      lang="ru" 
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
        
        {children}
      </body>
    </html>
  );
}