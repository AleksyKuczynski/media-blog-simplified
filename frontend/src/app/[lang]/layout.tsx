// src/app/[lang]/layout.tsx
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Navigation from '@/features/navigation/Navigation';
import Footer from '@/features/layout/Footer';
import Section from '@/features/layout/Section';
import QuickNavigationSection from '@/features/navigation/QuickNavigationSection';
import UnifiedBreadcrumbs from '@/features/navigation/Breadcrumbs/UnifiedBreadcrumbs';
import { getDictionary, type Lang } from '@/config/i18n';
import { SUPPORTED_LANGUAGES } from '@/config/constants/constants';
import { fetchRubricBasics, fetchAllCategories } from '@/api/directus';

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
  
  // Fetch data for breadcrumbs
  const [rubrics, categories] = await Promise.all([
    fetchRubricBasics(lang as Lang),
    fetchAllCategories(lang as Lang),
  ]);

  // Get pathname for breadcrumbs
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Determine if we should show breadcrumbs
  const showBreadcrumbs = 
    pathname !== `/${lang}` && 
    pathname !== `/${lang}/` &&
    !pathname.includes('/search') &&
    !pathname.match(new RegExp(`/${lang}/[^/]+/[^/]+$`)); // Exclude article pages

  return (
    <div lang={lang} className="container-fluid flex flex-col min-h-screen">
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
      
      <main 
        id="main-content" 
        className="flex-grow pt-16 xl:pt-24 min-h-screen" 
        role="main"
        tabIndex={-1}
        aria-label={dictionary.navigation.accessibility.skipToContent}
      >
        {showBreadcrumbs && (
          <Suspense fallback={null}>
            <UnifiedBreadcrumbs
              lang={lang as Lang}
              dictionary={dictionary}
              rubrics={rubrics}
              categories={categories}
              pathname={pathname}
            />
          </Suspense>
        )}
        
        <div data-dictionary-available="true" data-lang={lang}>
          {children}
        </div>
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