// src/app/layout.tsx - Ultra-simplified version

import '@/app/globals.scss';
import { fontSans, fontSerif, fontDisplay, fontCustom } from '@/app/fonts/fonts';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="ru" 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}