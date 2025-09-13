// src/app/ru/page.tsx - MIGRATED: Uses unified dictionary and new SEO architecture
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

// UPDATED: Use unified dictionary system
import { getDictionary } from '@/main/lib/dictionary/dictionary';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// UPDATED: Use new SEO architecture
import { NavigationSEOBundle } from '@/main/components/SEO';
import { generateNavigationMetadata } from '@/main/components/SEO/metadata/NavigationMetadata';

export const dynamic = 'force-dynamic';

// UPDATED: Use new SEO metadata generation with dictionary
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary('ru');
  
  return generateNavigationMetadata({
    dictionary,
    currentPath: '/',
    imageUrl: 'https://event4me.eu/og-home.jpg'
  });
}

export default async function Home() {
  // UPDATED: Single unified dictionary call
  const [dictionary, heroSlugs, rubrics] = await Promise.all([
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

  // Transform Rubric objects with complete data for RubricCard
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      articleCount: rubric.articleCount,
      nav_icon: rubric.nav_icon,
      iconMetadata: rubric.iconMetadata
    };
  });

  return (
    <>
      {/* UPDATED: Use new unified SEO system */}
      <NavigationSEOBundle 
        dictionary={dictionary}
        currentPath="/"
        minimal={false}
      />
      
      {/* Main content with enhanced semantic structure */}
      <article itemScope itemType="https://schema.org/WebPage">
        {/* Hero section */}
        <Section className="py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              {/* UPDATED: Use new dictionary structure */}
              <h1 className="text-4xl font-bold mb-4">
                {dictionary.sections.home.welcomeTitle}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {dictionary.sections.home.welcomeDescription}
              </p>
            </div>
            
            {/* Featured articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">
                {dictionary.sections.home.featuredContent}
              </h2>
              <Suspense fallback={
                <div className="text-center py-8">
                  {dictionary.common.loading}
                </div>
              }>
                <HeroArticles 
                  slugs={heroSlugs} 
                  // UPDATED: Pass unified dictionary sections
                  dictionary={dictionary}
                />
              </Suspense>
            </div>
          </div>
        </Section>

        {/* Rubrics section */}
        <Section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {dictionary.sections.home.exploreRubrics}
                </h2>
                <p className="text-muted-foreground">
                  {dictionary.sections.home.rubricsDescription}
                </p>
              </div>
              <Link 
                href="/ru/rubrics"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                {dictionary.sections.home.viewAllRubrics}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            
            <CardGrid>
              {transformedRubrics.map((rubric) => (
                <RubricCard 
                  key={rubric.slug}
                  rubric={rubric}
                  // UPDATED: Pass unified dictionary
                  dictionary={dictionary}
                />
              ))}
            </CardGrid>
          </div>
        </Section>
      </article>
    </>
  );
}