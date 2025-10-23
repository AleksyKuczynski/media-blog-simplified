// src/app/ru/page.tsx
// COMPLETE FIX: Unified dictionary system, complete implementation, proper SEO integration

import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import dictionary from '@/main/lib/dictionary/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

export const dynamic = 'force-dynamic';

// Enhanced SEO metadata generation
export async function generateMetadata(): Promise<Metadata> {
  
  return {
    title: dictionary.seo.site.fullName,
    description: dictionary.seo.site.description,
    keywords: dictionary.seo.keywords.base,
    openGraph: {
      title: dictionary.seo.site.fullName,
      description: dictionary.seo.site.description,
      url: dictionary.seo.site.url,
      siteName: dictionary.seo.site.name,
      locale: dictionary.locale,
      type: 'website',
      images: [
        {
          url: `${dictionary.seo.site.url}/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: dictionary.seo.site.fullName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.seo.site.fullName,
      description: dictionary.seo.site.description,
      images: [`${dictionary.seo.site.url}/og-home.jpg`],
    },
    alternates: {
      canonical: dictionary.seo.site.url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HomePage() {
  // Single unified dictionary call with proper error handling
  const [heroSlugs, rubrics] = await Promise.all([
    fetchHeroSlugs(DEFAULT_LANG).catch(error => {
      console.error('Error fetching hero articles:', error);
      return [];
    }),
    fetchAllRubrics(DEFAULT_LANG).catch(error => {
      console.error('Error fetching rubrics:', error);
      return [];
    })
  ]);

  // COMPLETE: Transform rubrics with proper typing and error handling
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations?.find(t => t.languages_code === DEFAULT_LANG);
    return {
      ...rubric, // Spread all original Rubric properties (includes any id if present)
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      icon: rubric.nav_icon, // Map nav_icon to expected icon property
      url: `/ru/${rubric.slug}`, // Add required url property
    };
  }).slice(0, 6); // Show only first 6 rubrics on home page

  // Enhanced structured data for home page
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": dictionary.seo.site.name,
    "alternateName": dictionary.seo.site.fullName,
    "url": dictionary.seo.site.url,
    "description": dictionary.seo.site.description,
    "inLanguage": "ru",
    "publisher": {
      "@type": "Organization",
      "name": dictionary.seo.site.name,
      "url": dictionary.seo.site.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${dictionary.seo.site.url}/logo.png`,
        "width": 200,
        "height": 80,
      },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${dictionary.seo.site.url}/search?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${dictionary.navigation.accessibility.primarySectionsLabel}`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "CollectionPage",
            "name": `${dictionary.navigation.labels.articles}`,
            "url": `${dictionary.seo.site.url}/ru/articles`,
          },
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "CollectionPage",
            "name": `${dictionary.navigation.labels.rubrics}`,
            "url": `${dictionary.seo.site.url}/ru/rubrics`,
          },
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "CollectionPage",
            "name": `${dictionary.navigation.labels.authors}`,
            "url": `${dictionary.seo.site.url}/ru/authors`,
          },
        },
      ],
    },
  };

  return (
    <>
      {/* Enhanced structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageSchema, null, 2)
        }}
      />
      
      {/* Main content with enhanced semantic structure */}
      <article itemScope itemType="https://schema.org/WebPage">
        {/* Hero section */}
        <Section className="py-8 bg-gradient-to-br from-sf-cont to-sf-hi">
          <div className="container mx-auto px-4">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-on-sf">
                {dictionary.sections.home.welcomeTitle}
              </h1>
              <p className="text-xl text-on-sf-var max-w-3xl mx-auto leading-relaxed">
                {dictionary.sections.home.welcomeDescription}
              </p>
            </header>
            
            {/* Featured articles section */}
            {heroSlugs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-on-sf">
                  {dictionary.sections.home.featuredContent}
                </h2>
                <Suspense fallback={
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prcolor mx-auto mb-4"></div>
                    <p className="text-on-sf-var">{dictionary.common.status.loading}</p>
                  </div>
                }>
                  <HeroArticles 
                    slugs={heroSlugs} 
                    dictionary={dictionary}
                  />
                </Suspense>
              </div>
            )}
          </div>
        </Section>

        {/* Rubrics section */}
        <Section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <header className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-on-sf">
                {dictionary.sections.home.exploreRubrics}
              </h2>
              <p className="text-lg text-on-sf-var max-w-2xl mx-auto mb-8">
                {dictionary.sections.home.rubricsDescription}
              </p>
              <Link 
                href="/ru/rubrics"
                className="
                  inline-flex items-center gap-2 
                  text-pr-cont hover:text-pr-fix 
                  font-medium transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2 rounded
                "
                aria-label={`${dictionary.sections.home.viewAllRubrics} - посмотреть полный каталог рубрик`}
              >
                {dictionary.sections.home.viewAllRubrics}
                <span 
                  className="transform transition-transform duration-200 group-hover:translate-x-1" 
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </header>
            
            {/* Rubrics grid */}
            {transformedRubrics.length > 0 ? (
              <CardGrid 
                cols={{
                  mobile: 1,
                  tablet: 2,
                  desktop: 3,
                  large: 3
                }}
                className="max-w-6xl mx-auto"
              >
                {transformedRubrics.map((rubric) => (
                  <RubricCard 
                    key={rubric.slug}
                    rubric={rubric}
                    dictionary={dictionary}
                  />
                ))}
              </CardGrid>
            ) : (
              <div className="text-center py-12">
                <p className="text-on-sf-var text-lg mb-4">
                  {dictionary.sections.rubrics.noRubricsAvailable}
                </p>
                <p className="text-on-sf-var">
                  {dictionary.sections.rubrics.checkBackLater}
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Call-to-action section */}
        <Section className="py-16 bg-pr-cont text-on-pr-cont">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {dictionary.sections.home.quickNavigation}
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ru/articles"
                className="
                  px-6 py-3 bg-on-pr-cont text-pr-cont rounded-lg
                  hover:bg-on-pr-cont/90 transition-colors duration-200
                  font-medium focus:outline-none focus:ring-2 focus:ring-on-pr-cont focus:ring-offset-2
                "
              >
                {dictionary.navigation.labels.articles}
              </Link>
              <Link
                href="/ru/authors"
                className="
                  px-6 py-3 bg-transparent border-2 border-on-pr-cont text-on-pr-cont rounded-lg
                  hover:bg-on-pr-cont hover:text-pr-cont transition-colors duration-200
                  font-medium focus:outline-none focus:ring-2 focus:ring-on-pr-cont focus:ring-offset-2
                "
              >
                {dictionary.navigation.labels.authors}
              </Link>
              <Link
                href="/ru/search"
                className="
                  px-6 py-3 bg-transparent border-2 border-on-pr-cont text-on-pr-cont rounded-lg
                  hover:bg-on-pr-cont hover:text-pr-cont transition-colors duration-200
                  font-medium focus:outline-none focus:ring-2 focus:ring-on-pr-cont focus:ring-offset-2
                "
              >
                {dictionary.navigation.labels.search}
              </Link>
            </div>
          </div>
        </Section>
      </article>
    </>
  );
}