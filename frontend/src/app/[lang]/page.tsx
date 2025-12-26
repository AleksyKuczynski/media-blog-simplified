// src/app/[lang]/page.tsx

import { Suspense } from 'react';
import HeroSection from '@/features/article-display/HeroSection';
import Section from '@/features/layout/Section';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import QuickNavigationSection from '@/features/navigation/QuickNavigationSection';
import HomePageSchema from '@/shared/seo/schemas/HomePageSchema';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchHeroSlugs } from '@/api/directus';
import { transformRubricsToCarousel } from '@/api/directus/transformToCarouselCards';
import { transformAuthorsToCarousel } from '@/api/directus/transformToCarouselCards';
import Link from 'next/link';

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);

  const [heroSlugs, rubricCards, authorCards] = await Promise.all([
    fetchHeroSlugs(lang).catch(error => {
      console.error('Error fetching hero articles:', error);
      return [];
    }),
    transformRubricsToCarousel(lang, 8).catch(error => {
      console.error('Error transforming rubrics:', error);
      return [];
    }),
    transformAuthorsToCarousel(lang, 8).catch(error => {
      console.error('Error transforming authors:', error);
      return [];
    })
  ]);

  return (
    <>
      <HomePageSchema
        dictionary={dictionary}
        lang={lang}
        currentPath={`/${lang}`}
      />

      <Suspense fallback={<div className="h-screen bg-sf" />}>
        <HeroSection 
          lang={lang} 
          dictionary={dictionary} 
          heroSlugs={heroSlugs} 
        />
      </Suspense>

      {rubricCards.length > 0 && (
        <Section 
          title={dictionary.sections.home.featuredRubrics}
          titleLevel="h2"
          variant='primary'
          hasNextSectionTitle={true}
        >
          {dictionary.sections.home.rubricsDescription && (
            <p className="text-lg text-on-sf-var max-w-2xl mx-auto mb-8 text-center">
              {dictionary.sections.home.rubricsDescription}
            </p>
          )}

          <CardCarousel
            cards={rubricCards}
            lang={lang}
            dictionary={dictionary}
          />

          <div className="text-center mt-8">
            <Link 
              href={`/${lang}/rubrics`}
              className="inline-flex items-center gap-2 text-pr-cont hover:text-pr-fix font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2 rounded group"
            >
              {dictionary.sections.home.viewAllRubrics}
              <span 
                className="transform transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </Section>
      )}

      {authorCards.length > 0 && (
        <Section 
          title={dictionary.sections.authors.ourAuthors}
          titleLevel="h2"
          variant='secondary'
          hasNextSectionTitle={true}
        >
          <CardCarousel
            cards={authorCards}
            lang={lang}
            dictionary={dictionary}
          />

          <div className="text-center mt-8">
            <Link 
              href={`/${lang}/authors`}
              className="inline-flex items-center gap-2 text-pr-cont hover:text-pr-fix font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2 rounded group"
            >
              {dictionary.sections.authors.allAuthors}
              <span 
                className="transform transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </Section>
      )}

      <Section 
        title={dictionary.sections.home.quickNavigation}
        titleLevel="h2"
        variant='tertiary'
      >
        <QuickNavigationSection lang={lang} dictionary={dictionary} />
      </Section>
    </>
  );
}