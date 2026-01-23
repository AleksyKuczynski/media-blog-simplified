// src/app/[lang]/HomePageSkeleton.tsx

import { SectionSkeleton } from '@/features/layout/SectionSkeleton';
import { HeroArticlesSkeleton } from '@/features/article-display/HeroArticlesSkeleton';
import { CardCarouselSkeleton } from '@/features/shared/CardCarousel/CardCarouselSkeleton';
import { Dictionary } from '@/config/i18n';

interface HomePageSkeletonProps {
  dictionary: Dictionary;
}

export function HomePageSkeleton({ dictionary }: HomePageSkeletonProps) {
  return (
    <>
      {/* Hero Articles Section */}
      <SectionSkeleton 
        variant="default"
        hasNextSectionTitle={true}
        ariaLabel={dictionary.common.status.loading}
      >
        <HeroArticlesSkeleton latestCount={3} />
        
        {/* ActionLink skeleton */}
        <div className="flex justify-end pr-4 md:pr-6 xl:pr-8 mt-6">
          <div className="h-5 w-32 bg-sf-hst rounded animate-pulse" />
        </div>
      </SectionSkeleton>

      {/* Rubrics Section */}
      <SectionSkeleton 
        variant="primary"
        hasNextSectionTitle={true}
        ariaLabel={dictionary.common.status.loading}
      >
        {/* Description skeleton */}
        {dictionary.sections.home.rubricsDescription && (
          <div className="max-w-2xl mx-auto mb-8 text-center space-y-2 px-4">
            <div className="h-6 bg-pr-sf/30 rounded w-full animate-pulse" />
            <div className="h-6 bg-pr-sf/30 rounded w-5/6 mx-auto animate-pulse" />
          </div>
        )}

        <CardCarouselSkeleton 
          cardCount={6}
          cardType="rubric"
          ariaLabel={dictionary.common.status.loading}
        />

        {/* ActionLink skeleton */}
        <div className="flex justify-end pr-4 md:pr-6 xl:pr-8 mt-6">
          <div className="h-5 w-40 bg-pr-sf/30 rounded animate-pulse" />
        </div>
      </SectionSkeleton>

      {/* Authors Section */}
      <SectionSkeleton 
        variant="tertiary"
        hasNextSectionTitle={true}
        ariaLabel={dictionary.common.status.loading}
      >
        <CardCarouselSkeleton 
          cardCount={4}
          cardType="author"
          ariaLabel={dictionary.common.status.loading}
        />

        {/* ActionLink skeleton */}
        <div className="flex justify-end pr-4 md:pr-6 xl:pr-8 mt-6">
          <div className="h-5 w-32 bg-tr-sf/30 rounded animate-pulse" />
        </div>
      </SectionSkeleton>
    </>
  );
}