// src/app/ru/layout.tsx
import { getDictionary } from '@/main/lib/dictionaries';
import Navigation from '@/main/components/Navigation/Navigation'
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { Metadata } from 'next';
import React from 'react';
import Footer from '@/main/components/Footer/Footer';

export const metadata: Metadata = {
  title: "My Blog",
  description: "Discover the latest trends, stories, and insights",
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
  // ✅ REMOVED: params: { lang: Lang } - no longer expected in static routes
}) {
  const dict: Dictionary = await getDictionary('ru'); // ✅ HARDCODED: Russian language

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-sf-cont" role="banner">
        <Navigation 
          lang="ru" 
          translations={{
            navigation: dict.navigation,
            search: dict.search,
            // ✅ REMOVED: themes: dict.themes - no longer needed for simplified theme system
            colors: dict.colors,
          }}
        />
      </header>
      <main className="flex-grow mt-16 md:mt-24 pt-4 md:pt-8" role="main">        
        {React.cloneElement(children as React.ReactElement, { searchTranslations: dict.search, sortingTranslations: dict.sorting })}      
      </main>
      <Footer
        lang="ru" // ✅ HARDCODED: Russian language
        translations={dict}
      />
    </>
  );
}