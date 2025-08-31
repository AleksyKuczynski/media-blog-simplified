// src/app/ru/page.tsx - SEO-Enhanced Home Page (Fixed Architecture)
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

  // Transform Rubric objects to the format RubricCard expects
  const transformedRubrics = rubrics.map((rubric: Rubric) => ({
    slug: rubric.slug,
    name: rubric.translations.find(t => t.languages_code === 'ru')?.name || rubric.slug,
    articleCount: rubric.articleCount
  }));

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
          
          {/* Semantic navigation hint */}
          <nav aria-label={dict.sections.home.quickNavigation} className="sr-only">
            <ul>
              <li><a href="#featured-articles">{dict.sections.articles.featuredArticles}</a></li>
              <li><a href="#rubrics-section">{dict.sections.home.exploreRubrics}</a></li>
            </ul>
          </nav>
        </Section>

        {/* Featured Articles Section - ✅ FIXED: Section handles heading internally */}
        <Section 
          id="featured-articles"
          as="section"
          ariaLabel={dict.sections.articles.featuredArticles}
          title={dict.sections.articles.featuredArticles}
          role="region"
        >
          {/* ✅ FIXED: Removed duplicate heading - Section component handles it */}
          <p className="text-center text-txcolor-secondary max-w-2xl mx-auto mb-8">
            {dict.sections.home.featuredDescription}
          </p>
          
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

        {/* Rubrics Section - ✅ FIXED: Section handles heading internally */}
        <Section 
          id="rubrics-section"
          isOdd={true}
          as="section"
          ariaLabel={dict.sections.home.exploreRubrics}
          title={dict.sections.home.exploreRubrics}
          role="region"
        >
          {/* ✅ FIXED: Removed duplicate heading - Section component handles it */}
          <p className="text-center text-txcolor-secondary max-w-2xl mx-auto mb-8">
            {dict.sections.home.rubricsDescription}
          </p>
          
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
          
          {/* ✅ CLARIFIED: Section footer - this is semantically correct */}
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