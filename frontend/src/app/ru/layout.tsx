// src/app/ru/layout.tsx
// Fixed to support both old and new dictionary systems during migration

import React from 'react'
import { Metadata } from 'next'
import Footer from '@/main/components/Footer/Footer'

// OLD: Import old dictionary system for non-migrated components
import { getDictionary as getOldDictionary } from '@/main/lib/dictionaries/dictionaries'
import { Dictionary as OldDictionary } from '@/main/lib/dictionaries/dictionariesTypes'

// NEW: Import new dictionary system for migrated Navigation
import { getDictionary as getNewDictionary } from '@/main/lib/dictionary/dictionary'
import { Dictionary as NewDictionary } from '@/main/lib/dictionary/types'
import Navigation from '@/main/components/Navigation/Navigation'

export const metadata: Metadata = {
  title: "EventForMe — Медиа о культурных событиях",
  description: "EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира",
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get both dictionaries during migration period
  const [oldDict, newDict] = await Promise.all([
    getOldDictionary('ru'), // For non-migrated components
    getNewDictionary('ru')  // For migrated Navigation
  ])

  return (
    <>
      {/* NEW: Enhanced Navigation with new dictionary system */}
      <Navigation 
        dictionary={newDict} // NEW: Use new dictionary system
        lang="ru" // KEEP: Lang parameter for compatibility with fetching library
        currentPath="" // Will be determined by usePathname in Navigation
        breadcrumbs={[]} // Can be enhanced later for specific pages
      />
      
      {/* Main content area with proper semantic structure */}
      <main 
        id="main-content" 
        className="flex-grow pt-16 xl:pt-24 min-h-screen" 
        role="main"
        tabIndex={-1}
        aria-label="Основное содержимое страницы"
      >        
        {/* OLD: Keep existing pattern for non-migrated components */}
        {React.cloneElement(children as React.ReactElement, { 
          searchTranslations: oldDict.search, // OLD: Search components need old dictionary
          sortingTranslations: oldDict.sorting // OLD: Sorting components need old dictionary
        })}      
      </main>
      
      {/* Footer with proper semantic structure and ID for skip links */}
      <footer 
        id="site-footer"
        role="contentinfo" 
        aria-label="Информация о сайте и дополнительные ссылки"
      >
        <Footer
          lang="ru" // KEEP: Lang parameter for compatibility
          translations={oldDict} // OLD: Footer still uses old dictionary system
        />
      </footer>
    </>
  )
}