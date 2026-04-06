// src/app/[lang]/layout.tsx
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Footer from '@/features/layout/Footer';
import { FooterSkeleton } from '@/features/layout/FooterSkeleton';
import Section from '@/features/layout/Section';
import QuickNavigationSection from '@/features/navigation/QuickNav/QuickNavigationSection';
import { QuickNavigationSkeleton } from '@/features/navigation/QuickNav/QuickNavigationSkeleton';
import { getDictionary, type Lang } from '@/config/i18n';
import { SUPPORTED_LANGUAGES } from '@/config/constants/constants';
import Navigation from '@/features/navigation/Header/Header';
import { NavigationSkeleton } from '@/features/navigation/Header/NavigationSkeleton';
import ConsentBanner from '@/features/analytics/ConsentBanner';

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
  const siteUrl = dictionary.seo.site.url;
  
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
      canonical: `${siteUrl}/${lang}`,
      languages: {
        'en': `${siteUrl}/en`,
        'ru': `${siteUrl}/ru`,
        'x-default': `${siteUrl}/ru`,
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
    <>
      <ConsentBanner dictionary={dictionary.consent} />
      <div lang={lang} className="container-fluid flex flex-col pt-16 xl:pt-32 min-h-screen">
        <Suspense fallback={<NavigationSkeleton />}>
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
            <QuickNavigationSkeleton ariaLabel={dictionary.common.status.loading} />
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
          <FooterSkeleton ariaLabel={dictionary.common.status.loading} />
        }>
          <Footer
            lang={lang as Lang}
            dictionary={dictionary}
          />
        </Suspense>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({
    lang: lang,
  }));
}