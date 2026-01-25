// src/app/[lang]/layout.tsx - SIMPLIFIED
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/features/layout/Footer';
import Section from '@/features/layout/Section';
import QuickNavigationSection from '@/features/navigation/QuickNav/QuickNavigationSection';
import { getDictionary, type Lang } from '@/config/i18n';
import { SUPPORTED_LANGUAGES } from '@/config/constants/constants';
import Navigation from '@/features/navigation/Header/Header';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
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
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'ru': '/ru',
      }
    },
  };
}

export default async function LanguageLayout({
  children,
  params
}: LayoutProps) {
  const { lang } = await params;
  
  if (!SUPPORTED_LANGUAGES.includes(lang as Lang)) {
    notFound();
  }
  
  const dictionary = getDictionary(lang as Lang);

  return (
    <div lang={lang} className="container-fluid flex flex-col pt-16 xl:pt-24 min-h-screen">
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
      
      <div className="flex-grow min-h-screen flex flex-col">
        <main 
          id="main-content" 
          className="flex-grow flex flex-col" 
          role="main"
          tabIndex={-1}
          aria-label={dictionary.navigation.accessibility.skipToContent}
        >
          {children}
        </main>
        
        <Suspense fallback={
          <div className="h-32 bg-gray-50 border-t border-gray-200" />
        }>
          <Section 
            title={dictionary.sections.home.quickNavigation}
            titleLevel="h2"
          >
            <QuickNavigationSection lang={lang as Lang} dictionary={dictionary} />
          </Section>
        </Suspense>
      </div>

      <Suspense fallback={
        <div className="h-32 bg-gray-50 border-t border-gray-200" />
      }>
        <Footer
          lang={lang as Lang}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang: lang,
  }));
}