// src/app/ru/layout.tsx - Enhanced Layout with SEO Navigation Integration (Fixed)
import { getDictionary } from '@/main/lib/dictionaries';
import Navigation from '@/main/components/Navigation/Navigation'
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { Metadata } from 'next';
import React from 'react';
import Footer from '@/main/components/Footer/Footer';

export const metadata: Metadata = {
  title: "EventForMe — Медиа о культурных событиях",
  description: "EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира",
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dict: Dictionary = await getDictionary('ru');

  return (
    <>
      {/* Enhanced Navigation with SEO improvements - Fixed positioning */}
      <Navigation 
        lang="ru"
        translations={{
          navigation: dict.navigation,
          search: dict.search,
        }}
      />
      
      {/* Main content area with proper semantic structure */}
      <main 
        id="main-content" 
        className="flex-grow pt-16 xl:pt-24 min-h-screen" 
        role="main"
        tabIndex={-1}
        aria-label="Основное содержимое страницы"
      >        
        {React.cloneElement(children as React.ReactElement, { 
          searchTranslations: dict.search, 
          sortingTranslations: dict.sorting 
        })}      
      </main>
      
      {/* Footer with proper semantic structure and ID for skip links */}
      <footer 
        id="site-footer"
        role="contentinfo" 
        aria-label="Информация о сайте и дополнительные ссылки"
      >
        <Footer
          lang="ru"
          translations={dict}
        />
      </footer>
    </>
  );
}