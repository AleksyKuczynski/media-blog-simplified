// src/app/layout.tsx

import '@/app/globals.scss';
import { fontSans, fontSerif, fontDisplay, fontCustom } from '@/app/fonts/fonts';
import YandexMetrika from '@/main/components/Analytics/YandexMetrika';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

  return (
    <html 
      lang="ru" 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <head>
        {/* Yandex.Metrika - loaded in head for earliest initialization */}
        {yandexMetrikaId && <YandexMetrika counterId={yandexMetrikaId} />}
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}