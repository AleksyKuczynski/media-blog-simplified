// src/app/ru/page.tsx - SEO-Enhanced Home Page
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/main/lib/dictionaries';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import { HomePageSchema } from '@/main/components/SEO/HomePageSchema';
import { EnhancedHomePageMetadata } from '@/main/components/SEO/EnhancedHomePageMetadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('ru');
  
  // Enhanced metadata using comprehensive SEO dictionary entries
  return {
    title: dict.seo.titles.homePrefix,
    description: dict.seo.descriptions.home,
    keywords: dict.seo.keywords.general,
    
    // Open Graph optimization for social sharing
    openGraph: {
      title: dict.seo.titles.homePrefix,
      description: dict.seo.descriptions.home,
      url: 'https://event4me.eu/ru',
      siteName: dict.seo.siteName,
      locale: 'ru_RU',
      type: 'website',
      images: [
        {
          url: 'https://event4me.eu/og-home.jpg',
          width: 1200,
          height: 630,
          alt: dict.sections.home.welcomeTitle,
        },
      ],
    },
    
    // Twitter Card optimization
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.titles.homePrefix,
      description: dict.seo.descriptions.home,
      images: ['https://event4me.eu/og-home.jpg'],
    },

    // Additional SEO enhancements
    alternates: {
      canonical: 'https://event4me.eu/ru',
    },
    
    // Yandex-specific optimizations
    other: {
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
    },
  };
}

export default async function Home() {
  const [dict, heroSlugs, rubrics] = await Promise.all([
    getDictionary('ru'),
    fetchHeroSlugs('ru').catch(error => {
      console.error('Error fetching hero articles:', error);
      return [];
    }),
    fetchAllRubrics('ru').catch(error => {
      console.error('Error fetching rubrics:', error);
      return [];
    })
  ]);

  // Transform Rubric objects to the format RubricCard expects
  const transformedRubrics = rubrics.map((rubric: Rubric) => ({
    slug: rubric.slug,
    name: rubric.translations.find(t => t.languages_code === 'ru')?.name || rubric.slug,
    articleCount: rubric.articleCount
  }));

  // Prepare data for schema
  const schemaData = {
    site: {
      name: dict.seo.siteName,
      url: 'https://event4me.eu',
      description: dict.seo.descriptions.home,
    },
    articles: {
      featured: [], // Will be populated by HeroArticles data if needed
      latest: [],
    },
    rubrics: rubrics,
  };

  return (
    <>
      {/* Enhanced metadata and schema components */}
      <EnhancedHomePageMetadata />
      <HomePageSchema data={schemaData} />
      
      {/* Main content with enhanced semantic structure */}
      <article itemScope itemType="https://schema.org/WebPage">
        {/* Hero Section - Enhanced with semantic markup */}
        <Section 
          isOdd={true}
          as="section"
          ariaLabel={dict.sections.home.welcomeTitle}
          className="text-center"
        >
          <div itemScope itemType="https://schema.org/Organization">
            <h1 
              className="text-4xl md:text-6xl font-bold text-prcolor mb-4 text-center"
              itemProp="name"
            >
              {dict.sections.home.welcomeTitle}
            </h1>
            <p 
              className="text-xl text-accolor text-center mb-8 max-w-4xl mx-auto"
              itemProp="description"
            >
              {dict.sections.home.welcomeDescription}
            </p>
          </div>
          
          {/* Semantic navigation hint */}
          <nav aria-label={dict.sections.home.quickNavigation} className="sr-only">
            <ul>
              <li><a href="#featured-articles">{dict.sections.articles.featuredArticles}</a></li>
              <li><a href="#rubrics-section">{dict.sections.home.exploreRubrics}</a></li>
            </ul>
          </nav>
        </Section>

        {/* Featured Articles Section - Enhanced semantic structure */}
        <Section 
          id="featured-articles"
          as="section"
          ariaLabel={dict.sections.articles.featuredArticles}
          role="region"
        >
          <header className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-4">
              {dict.sections.articles.featuredArticles}
            </h2>
            <p className="text-center text-txcolor-secondary max-w-2xl mx-auto">
              {dict.sections.home.featuredDescription}
            </p>
          </header>
          
          <Suspense fallback={
            <div className="text-center p-8" role="status" aria-label={dict.common.loading}>
              <span className="sr-only">{dict.common.loading}</span>
              {dict.common.loading}
            </div>
          }>
            {heroSlugs.length > 0 ? (
              <HeroArticles heroSlugs={heroSlugs} lang="ru" />
            ) : (
              <div className="text-center text-txcolor-secondary p-8">
                {dict.sections.articles.noFeaturedArticles}
              </div>
            )}
          </Suspense>
        </Section>

        {/* Rubrics Section - Enhanced with comprehensive semantic markup */}
        <Section 
          id="rubrics-section"
          isOdd={true}
          as="section"
          ariaLabel={dict.sections.home.exploreRubrics}
          title={dict.sections.home.exploreRubrics}
          role="region"
        >
          <header className="mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 pl-1 text-sf-hst">
              {dict.sections.home.exploreRubrics}
            </h2>
            <p className="text-center text-txcolor-secondary max-w-2xl mx-auto">
              {dict.sections.home.rubricsDescription}
            </p>
          </header>
          
          <div itemScope itemType="https://schema.org/ItemList">
            <CardGrid>
              {transformedRubrics.length > 0 ? (
                transformedRubrics.map((rubric, index) => (
                  <div 
                    key={rubric.slug}
                    itemScope 
                    itemType="https://schema.org/Thing"
                    itemProp="itemListElement"
                  >
                    <RubricCard
                      rubric={rubric}
                      lang="ru"
                      dict={dict} // Pass dictionary for proper Russian text
                    />
                    <meta itemProp="position" content={`${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="text-center text-txcolor-secondary p-8 col-span-full">
                  {dict.sections.rubrics.noRubricsAvailable}
                </div>
              )}
            </CardGrid>
          </div>
          
          <footer className="mt-8 text-center">
            <Link
              href="/ru/rubrics"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-describedby="view-all-rubrics-desc"
            >
              {dict.sections.home.viewAllRubrics}
            </Link>
            <p id="view-all-rubrics-desc" className="sr-only">
              {dict.sections.home.viewAllRubricsDescription}
            </p>
          </footer>
        </Section>
      </article>
    </>
  );
}