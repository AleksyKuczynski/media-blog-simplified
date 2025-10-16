// src/app/ru/layout.tsx
// FIXED: Removed problematic React.cloneElement, simplified prop passing, better type safety

import React, { Suspense } from 'react'
import { Metadata } from 'next'
import Footer from '@/main/components/Footer/Footer'
import Navigation from '@/main/components/Navigation/Navigation'
import dictionary from '@/main/lib/dictionary/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants';

// Generate metadata using dictionary
export async function generateMetadata(): Promise<Metadata> {
  
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation with unified dictionary system */}
      <Suspense fallback={
        <div className="h-16 xl:h-24 bg-white border-b border-gray-200 flex items-center">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-32" />
          </div>
        </div>
      }>
        <Navigation 
          dictionary={dictionary}
          lang={DEFAULT_LANG}
          currentPath=""
          breadcrumbs={[]}
        />
      </Suspense>
      
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
      <Suspense fallback={
        <div className="h-32 bg-gray-50 border-t border-gray-200" />
      }>
        <Footer
          lang={DEFAULT_LANG}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}