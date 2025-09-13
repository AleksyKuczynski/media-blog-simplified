// src/main/components/Main/HeroArticles.tsx - MIGRATED: Uses unified dictionary
import { Suspense } from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import ArticleCard from '../ArticleCards/ArticleCard';

interface HeroArticlesProps {
  slugs: string[]; // UPDATED: More descriptive prop name
  dictionary: Dictionary; // NEW: Unified dictionary instead of separate translations
  rubricSlug?: string;
}

export default function HeroArticles({ slugs, dictionary, rubricSlug }: HeroArticlesProps) {
  if (slugs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {dictionary.sections.articles.noFeaturedArticles}
      </div>
    );
  }

  const [promotedSlug, ...latestSlugs] = slugs;

  return (
    <Suspense fallback={
      <div className="p-8 text-center">
        {dictionary.common.loading}
      </div>
    }>
      <div className="
        grid grid-cols-1 xl:grid-cols-2
        container mx-auto 
        py-6 md:py-8 lg:py-12
        sm:px-6 2xl:px-8
        gap-6 lg:gap-8
      ">
        {/* Promoted Article */}
        <div className="
          col-span-full xl:col-span-1
          pb-12 md:pb-0
        ">
          <ArticleCard 
            slug={promotedSlug} 
            lang="ru" // UPDATED: Static lang since we're Russian-only
            rubricSlug={rubricSlug} 
            layout="promoted"
            dictionary={dictionary} // NEW: Pass unified dictionary
          />
        </div>
        
        {/* Latest Articles Grid */}
        <div className="
          grid 
          grid-cols-1 md:max-xl:grid-cols-3 
          gap-6 lg:gap-8
        ">
          {latestSlugs.map((slug) => (
            <ArticleCard 
              key={slug} 
              slug={slug} 
              lang="ru" // UPDATED: Static lang since we're Russian-only
              rubricSlug={rubricSlug} 
              layout="latest"
              dictionary={dictionary} // NEW: Pass unified dictionary
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
}