// src/app/ru/layout.tsx - Ultra-simplified main layout
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
  // ✅ REMOVED: No more params needed
}) {
  const dict: Dictionary = await getDictionary('ru');

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg" role="banner">
        {/* ✅ SIMPLIFIED: Direct Tailwind classes instead of CSS variables */}
        <Navigation 
          lang="ru"
          translations={{
            navigation: dict.navigation,
            search: dict.search,
            colors: dict.colors, // ✅ Keep only if you want color scheme switching
          }}
        />
      </header>
      <main className="flex-grow mt-16 md:mt-24 pt-4 md:pt-8" role="main">        
        {React.cloneElement(children as React.ReactElement, { searchTranslations: dict.search, sortingTranslations: dict.sorting })}      
      </main>
      <Footer
        lang="ru"
        translations={dict}
      />
    </>
  );
}