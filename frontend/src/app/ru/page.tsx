// src/app/ru/page.tsx - Complete Enhanced Home Page with RubricCard Descriptions
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import { HomePageSchema } from '@/main/components/SEO/HomePageSchema';
import { EnhancedHomePageMetadata } from '@/main/components/SEO/EnhancedHomePageMetadata';
import { generateHomePageMetadata, prepareHomePageSchemaData } from '@/main/lib/metadata/homePageMetadata';

export const dynamic = 'force-dynamic';

// ✅ FIXED: Separated metadata generation from presentation
export async function generateMetadata(): Promise<Metadata> {
  return generateHomePageMetadata();
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

  // ✅ ENHANCED: Transform Rubric objects with complete data for RubricCard
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description || '', // ✅ NEW: Include description
      articleCount: rubric.articleCount,
      nav_icon: rubric.nav_icon,
      iconMetadata: rubric.iconMetadata
    };
  });

  // ✅ FIXED: Use utility function for schema data preparation
  const schemaData = await prepareHomePageSchemaData(heroSlugs, rubrics);

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

          {/* Hero Articles Section */}
          <div className="mt-12">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-sf-cont animate-pulse rounded-lg" />
                ))}
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
          </div>
        </Section>

        {/* ✅ ENHANCED: Rubrics Section with Descriptions and Icons */}
        <Section 
          isOdd={false}
          as="section"
          ariaLabel={dict.sections.home.featuredRubrics}
          className="py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-sf mb-6">
              {dict.sections.home.featuredRubrics}
            </h2>
            <p className="text-on-sf-var text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              {dict.sections.home.rubricsSectionDescription}
            </p>
          </div>
          
          <div itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="numberOfItems" content={transformedRubrics.length.toString()} />
            
            {/* ✅ ENHANCED: Grid with improved spacing for description content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {transformedRubrics.length > 0 ? (
                transformedRubrics.map((rubric, index) => (
                  <div 
                    key={rubric.slug}
                    itemScope 
                    itemType="https://schema.org/Thing"
                    itemProp="itemListElement"
                    className="h-full" // Ensure consistent card heights
                  >
                    <RubricCard
                      rubric={rubric}
                      lang="ru"
                      dict={dict}
                    />
                    <meta itemProp="position" content={`${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="text-center text-on-sf-var p-8 col-span-full">
                  <p className="text-lg mb-4">{dict.sections.rubrics.noRubricsAvailable}</p>
                  <p className="text-sm">{dict.sections.rubrics.checkBackLater}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* ✅ ENHANCED: Section footer with better spacing */}
          <footer className="mt-12 text-center">
            <Link
              href="/ru/rubrics"
              className="
                inline-flex items-center justify-center 
                px-8 py-4 text-base font-semibold rounded-lg
                text-white bg-pr-cont hover:bg-pr-cont/90 
                transition-all duration-300 transform hover:scale-105
                focus:ring-4 focus:ring-pr-cont/25 focus:outline-none
                shadow-lg hover:shadow-xl
              "
              aria-describedby="view-all-rubrics-desc"
            >
              {dict.sections.home.viewAllRubrics}
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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