// src/app/[lang]/layout.tsx
import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navigation from '@/features/navigation/Navigation'
import { getDictionary, type Lang } from '@/main/lib/dictionary'
import { SUPPORTED_LANGUAGES } from '@/main/lib/constants/constants'
import Footer from '@/features/layout/Footer'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

// Generate metadata dynamically based on language
export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = getDictionary(lang as Lang)
  
  return {
    title: dictionary.seo.site.name,
    description: dictionary.seo.site.description,
    openGraph: {
      title: dictionary.seo.site.fullName,
      description: dictionary.seo.site.description,
      siteName: dictionary.seo.site.name,
      locale: dictionary.locale,
      type: 'website',
    },
    twitter: {
      title: dictionary.seo.site.name,
      description: dictionary.seo.site.description,
      card: 'summary_large_image',
    },
    alternates: {
      canonical: dictionary.seo.site.url,
      languages: {
        'en': '/en',
        'ru': '/ru',
      }
    },
  }
}

export default async function LanguageLayout({
  children,
  params
}: LayoutProps) {
  const { lang } = await params
  
  // Validate language parameter
  if (!SUPPORTED_LANGUAGES.includes(lang as Lang)) {
    notFound()
  }
  
  // Get dictionary for current language
  const dictionary = getDictionary(lang as Lang)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Suspense fallback={
        <div className="h-16 xl:h-24 bg-white border-b border-gray-200 flex items-center">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse w-32" />
          </div>
        </div>
      }>
        <Navigation 
          dictionary={dictionary}
          lang={lang as Lang}
          currentPath=""
          breadcrumbs={[]}
        />
      </Suspense>
      
      {/* Main content */}
      <main 
        id="main-content" 
        className="flex-grow pt-16 xl:pt-24 min-h-screen" 
        role="main"
        tabIndex={-1}
        aria-label={dictionary.navigation.accessibility.skipToContent}
      >        
        <div data-dictionary-available="true" data-lang={lang}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Suspense fallback={
        <div className="h-32 bg-gray-50 border-t border-gray-200" />
      }>
        <Footer
          lang={lang as Lang}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  )
}

// Generate static params for both languages
export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang: lang,
  }))
}