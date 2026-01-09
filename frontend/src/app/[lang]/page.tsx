// src/app/[lang]/page.tsx

import { Suspense } from 'react';
import HeroSection from '@/features/article-display/HeroSection';
import HeroArticles from '@/features/article-display/HeroArticles';
import { HeroArticlesSkeleton } from '@/features/article-display/HeroArticlesSkeleton';
import Section from '@/features/layout/Section';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import QuickNavigationSection from '@/features/navigation/QuickNavigationSection';
import HomePageSchema from '@/shared/seo/schemas/HomePageSchema';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchHeroSlugs } from '@/api/directus';
import { transformRubricsToCarousel } from '@/api/directus/transformToCarouselCards';
import { transformAuthorsToCarousel } from '@/api/directus/transformToCarouselCards';
import { ActionLink } from '@/shared/primitives/ActionLink';

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
    transformRubricsToCarousel(lang, 6).catch(error => {
      console.error('Error transforming rubrics:', error);
      return [];
    }),
    transformAuthorsToCarousel(lang, 4).catch(error => {
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

      <HeroSection dictionary={dictionary} />

      {heroSlugs.length > 0 && (
        <Section 
          title={dictionary.sections.home.featuredContent}
          titleLevel="h2"
          variant="default"
          hasNextSectionTitle={true}
        >
          <Suspense fallback={<HeroArticlesSkeleton latestCount={3} />}>
            <HeroArticles 
              slugs={heroSlugs}
              lang={lang} 
              dictionary={dictionary}
            />
          </Suspense>

          <ActionLink 
            href={`/${lang}/articles`}
          >
            {dictionary.sections.home.viewAllArticles}
          </ActionLink>
        </Section>
      )}

      {rubricCards.length > 0 && (
        <Section 
          title={dictionary.sections.home.featuredRubrics}
          titleLevel="h2"
          variant="primary"
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

          <ActionLink 
            href={`/${lang}/rubrics`}
            variant="primary"
          >
            {dictionary.sections.home.viewAllRubrics}
          </ActionLink>
        </Section>
      )}

      {authorCards.length > 0 && (
        <Section 
          title={dictionary.sections.authors.ourAuthors}
          titleLevel="h2"
          variant="tertiary"
          hasNextSectionTitle={true}
        >
          <CardCarousel
            cards={authorCards}
            lang={lang}
            dictionary={dictionary}
          />

          <ActionLink 
            href={`/${lang}/authors`}
            variant="tertiary"
          >
            {dictionary.sections.authors.allAuthors}
          </ActionLink>
        </Section>
      )}

      <Section 
        title={dictionary.sections.home.quickNavigation}
        titleLevel="h2"
      >
        <QuickNavigationSection lang={lang} dictionary={dictionary} />
      </Section>
    </>
  );
}