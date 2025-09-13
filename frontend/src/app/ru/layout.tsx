// src/app/ru/layout.tsx
// MIGRATED: Now uses only the unified dictionary system - NO HARDCODED CONTENT

import React from 'react'
import { Metadata } from 'next'
import Footer from '@/main/components/Footer/Footer'
import Navigation from '@/main/components/Navigation/Navigation'
import { getDictionary } from '@/main/lib/dictionary/dictionary'

// Generate metadata using dictionary
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary('ru');
  
  return {
    title: dictionary.seo.titles.homePrefix,
    description: dictionary.seo.descriptions.home,
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // UNIFIED: Single dictionary call
  const dictionary = await getDictionary('ru');

  return (
    <>
      {/* Navigation with unified dictionary system */}
      <Navigation 
        dictionary={dictionary}
        lang="ru"
        currentPath=""
        breadcrumbs={[]}
      />
      
      {/* Main content area with proper semantic structure */}
      <main 
        id="main-content" 
        className="flex-grow pt-16 xl:pt-24 min-h-screen" 
        role="main"
        tabIndex={-1}
        aria-label={dictionary.navigation.accessibility.skipToContent}
      >        
        {/* UPDATED: Pass unified dictionary sections to children */}
        {React.cloneElement(children as React.ReactElement, { 
          // Components can now access unified dictionary sections
          searchTranslations: dictionary.search,
          sortingTranslations: dictionary.sorting,
          sectionsTranslations: dictionary.sections,
          commonTranslations: dictionary.common,
          categoriesTranslations: dictionary.categories,
          filterTranslations: dictionary.filter,
          accessibilityTranslations: dictionary.accessibility,
          // Keep full dictionary available for gradual migration
          dictionary: dictionary
        })}      
      </main>
      
      {/* Footer with unified dictionary system */}
      <footer 
        id="site-footer"
        role="contentinfo" 
        aria-label={dictionary.footer.about.description}
      >
        <Footer
          lang="ru"
          dictionary={dictionary}
        />
      </footer>
    </>
  )
}