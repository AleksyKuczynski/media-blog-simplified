// src/app/ru/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionary } from '@/main/lib/dictionaries';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import RubricCard from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// ✅ REMOVED: HomeProps interface - no longer need lang parameter

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  // ✅ REMOVED: params parameter - use hardcoded Russian
  const dict = await getDictionary('ru');
  return {
    title: dict.sections.home.welcomeTitle,
    description: dict.sections.home.welcomeDescription,
  };
}

export default async function Home() {
  // ✅ REMOVED: params parameter - use hardcoded Russian
  const [dict, heroSlugs, rubrics] = await Promise.all([
    getDictionary('ru'), // ✅ HARDCODED: Russian language
    fetchHeroSlugs('ru').catch(error => { // ✅ HARDCODED: Russian language
      console.error('Error fetching hero articles:', error);
      return [];
    }),
    fetchAllRubrics('ru').catch(error => { // ✅ HARDCODED: Russian language
      console.error('Error fetching rubrics:', error);
      return [];
    })
  ]);

  return (
    <>
      <Section isOdd={true}>
        <h1 className="text-4xl md:text-6xl font-bold text-prcolor mb-4 text-center">
          {dict.sections.home.welcomeTitle}
        </h1>
        <p className="text-xl text-accolor text-center mb-8">
          {dict.sections.home.welcomeDescription}
        </p>
      </Section>

      <Section 
        ariaLabel={dict.sections.articles.featuredArticles}
      >
        <Suspense fallback={<div>{dict.common.loading}</div>}>
          {heroSlugs.length > 0 ? (
            <HeroArticles heroSlugs={heroSlugs} lang="ru" />
          ) : (
            <div>{dict.sections.articles.noFeaturedArticles}</div>
          )}
        </Suspense>
      </Section>

      <Section 
        isOdd={true}
        ariaLabel={dict.sections.home.exploreRubrics}
        title={dict.sections.home.exploreRubrics}
      >
        <CardGrid>
          {rubrics.length > 0 ? (
            rubrics.map((rubric: Rubric) => (
              <RubricCard
                key={rubric.slug}
                rubric={rubric}
                lang="ru" // ✅ HARDCODED: Russian language
              />
            ))
          ) : (
            <div>No rubrics available</div>
          )}
        </CardGrid>
        <div className="mt-8 text-center">
          <Link
            href="/ru/rubrics" // ✅ HARDCODED: Static Russian URL
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
          >
            {dict.sections.home.viewAllRubrics}
          </Link>
        </div>
      </Section>
    </>
  );
}