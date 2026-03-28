// app/[lang]/page.tsx
import { Suspense } from 'react';
import { getDictionary, Lang } from '@/config/i18n';
import HeroArticles from '@/features/article-display/HeroArticles';
import HeroSection from '@/features/article-display/HeroSection';
import AuthorsCarouselSection from '@/features/author-display/AuthorsCarouselSection';
import RubricsCarouselSection from '@/features/rubric-display/RubricsCarouselSection';
import HomePageSchema from '@/shared/seo/schemas/HomePageSchema';
import { HeroArticlesSkeleton } from '@/features/article-display/HeroArticlesSkeleton';
import { CardCarouselSkeleton } from '@/features/shared/CardCarousel/CardCarouselSkeleton';
import Section from '@/features/layout/Section';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);

  return (
    <>
      <HomePageSchema
        dictionary={dictionary}
        lang={lang}
        currentPath={`/${lang}`}
      />

      {/* HeroSection renders immediately - no data fetching */}
      <HeroSection lang={lang} dictionary={dictionary} />

      {/* Wrap each data-fetching component in Suspense */}
      <Suspense fallback={
        <Section variant="default" hasNextSectionTitle={true}>
          <HeroArticlesSkeleton latestCount={3} />
        </Section>
      }>
        <HeroArticles 
          lang={lang} 
          dictionary={dictionary}
        />
      </Suspense>

      <Suspense fallback={
        <Section 
          title={dictionary.sections.home.featuredRubrics}
          variant="primary" 
          hasNextSectionTitle={true}
        >
          <CardCarouselSkeleton 
            cardCount={6}
            cardType="rubric"
            ariaLabel={dictionary.common.status.loading}
          />
        </Section>
      }>
        <RubricsCarouselSection
          lang={lang}
          dictionary={dictionary}
          title={dictionary.sections.home.featuredRubrics}
          variant="primary"
          limit={6}
        />
      </Suspense>

      <Suspense fallback={
        <Section 
          title={dictionary.sections.authors.ourAuthors}
          variant="tertiary" 
          hasNextSectionTitle={true}
        >
          <CardCarouselSkeleton 
            cardCount={6}
            cardType="author"
            ariaLabel={dictionary.common.status.loading}
          />
        </Section>
      }>
        <AuthorsCarouselSection
          lang={lang}
          dictionary={dictionary}
          title={dictionary.sections.authors.ourAuthors}
          variant="tertiary"
          limit={6}
        />
      </Suspense>
    </>
  );
}