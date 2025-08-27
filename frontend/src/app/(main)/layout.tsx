// src/app/[lang]/(main)/layout.tsx
import { getDictionary } from '@/main/lib/dictionaries';
import Navigation from '@/main/components/Navigation/Navigation'
import { Lang, Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { Metadata } from 'next';
import React from 'react';
import Footer from '@/main/components/Footer/Footer';

export const metadata: Metadata = {
  title: "My Blog",
  description: "Discover the latest trends, stories, and insights",
}

export default async function MainLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: Lang }
}) {
  const dict: Dictionary = await getDictionary(lang);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-sf-cont" role="banner">
        <Navigation 
          lang={lang} 
          translations={{
            navigation: dict.navigation,
            search: dict.search,
            themes: dict.themes,
            colors: dict.colors,
          }}
        />
      </header>
      <main className="flex-grow mt-16 md:mt-24 pt-4 md:pt-8" role="main">        
        {React.cloneElement(children as React.ReactElement, { searchTranslations: dict.search, sortingTranslations: dict.sorting })}      
      </main>
      <Footer
        lang={lang} 
        translations={dict}
      />
    </>
  );
}