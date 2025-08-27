// src/app/layout.tsx - Fixed version

import '@/app/globals.scss';
import { fontSans, fontSerif, fontDisplay, fontCustom } from '@/app/fonts/fonts';
import { ThemeProvider, ColorProvider, getColorMode, getColorScheme, getTheme } from '@/main/components/ThemeSwitcher';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  // ✅ REMOVED: params: { lang: Lang } - no longer expected
}) {
  const initialTheme = await getTheme();
  const initialColorMode = await getColorMode();
  const initialColorScheme = await getColorScheme();
  
  return (
    <html 
      lang="ru" // ✅ HARDCODED: Russian instead of dynamic lang
      data-theme={initialTheme} 
      data-color-mode={initialColorMode} 
      className={`${fontSans.variable} ${fontSerif.variable} ${fontDisplay.variable} ${fontCustom.variable}`}
    >
      <ThemeProvider initialTheme={initialTheme} initialColorMode={initialColorMode}>
        <ColorProvider initialColorScheme={initialColorScheme}>
          <body data-color-scheme={initialColorScheme} className={`flex flex-col min-h-screen bg-sf text-on-sf theme-${initialTheme} transition-colors duration-300`}>
            {children}
          </body>
        </ColorProvider>
    </ThemeProvider>
    </html>
  );
}