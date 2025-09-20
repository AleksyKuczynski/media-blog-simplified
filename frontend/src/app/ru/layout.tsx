// src/app/ru/layout.tsx
// FIXED: Removed problematic React.cloneElement, simplified prop passing, better type safety

import React from 'react'
import { Metadata } from 'next'
import Footer from '@/main/components/Footer/Footer'
import Navigation from '@/main/components/Navigation/Navigation'
import getDictionary from '@/main/lib/dictionary/getDictionary';

// Generate metadata using dictionary
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary('ru');
  
  return {
    title: dictionary.seo.site.name,
    description: dictionary.seo.site.description,
    openGraph: {
      title: dictionary.seo.site.fullName,
      description: dictionary.seo.site.description,
      siteName: dictionary.seo.site.name,
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      title: dictionary.seo.site.name,
      description: dictionary.seo.site.description,
      card: 'summary_large_image',
    },
    alternates: {
      canonical: dictionary.seo.site.url,
    },
  };
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Single dictionary call for the entire layout
  const dictionary = await getDictionary('ru');

  return (
    <div className="flex flex-col min-h-screen">
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
        {/* FIXED: Simple children rendering without cloneElement */}
        <div data-dictionary-available="true">
          {children}
        </div>
      </main>
      
      {/* Footer with unified dictionary system */}
      <Footer
        lang="ru"
        dictionary={dictionary}
      />
    </div>
  );
}

// Export dictionary for child components to use
export async function getLayoutDictionary() {
  return await getDictionary('ru');
}