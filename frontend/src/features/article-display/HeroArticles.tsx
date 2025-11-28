// src/main/components/Main/HeroArticles.tsx

import { Suspense } from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import ArticleCard from './ArticleCard';
import { HeroArticlesSkeleton } from './HeroArticlesSkeleton';

interface HeroArticlesProps {
  slugs: string[];
  lang: Lang;
  dictionary: Dictionary;
  rubricSlug?: string;
}

// ✅ EXTRACT HERO ARTICLES STYLING CONSTANTS
export const HERO_ARTICLES_STYLES = {
  container: 'grid grid-cols-1 xl:grid-cols-2 container mx-auto py-6 md:py-8 lg:py-12 sm:px-6 2xl:px-8 gap-6 lg:gap-8',
  
  // Promoted article section
  promoted: {
    wrapper: 'col-span-full xl:col-span-1 pb-12 md:pb-0',
  },
  
  // Latest articles grid
  latest: {
    wrapper: 'grid grid-cols-1 md:max-xl:grid-cols-3 gap-6 lg:gap-8',
  },
  
  // Empty state
  empty: 'text-center py-8 text-muted-foreground',
} as const;

// ✅ SKELETON STYLES - Inherit from main component
export const HERO_ARTICLES_SKELETON_STYLES = {
  container: HERO_ARTICLES_STYLES.container,
  promoted: HERO_ARTICLES_STYLES.promoted,
  latest: HERO_ARTICLES_STYLES.latest,
} as const;

export default function HeroArticles({ slugs, lang, dictionary, rubricSlug }: HeroArticlesProps) {
  if (slugs.length === 0) {
    return (
      <div className={HERO_ARTICLES_STYLES.empty}>
        {dictionary.sections.articles.noFeaturedArticles}
      </div>
    );
  }

  const [promotedSlug, ...latestSlugs] = slugs;

  return (
    <Suspense fallback={
      <HeroArticlesSkeleton latestCount={latestSlugs.length} />
    }>
      <div className={HERO_ARTICLES_STYLES.container}>
        {/* Promoted Article */}
        <div className={HERO_ARTICLES_STYLES.promoted.wrapper}>
          <ArticleCard 
            slug={promotedSlug} 
            lang={lang}
            rubricSlug={rubricSlug} 
            layout="promoted"
            dictionary={dictionary}
          />
        </div>
        
        {/* Latest Articles Grid */}
        <div className={HERO_ARTICLES_STYLES.latest.wrapper}>
          {latestSlugs.map((slug) => (
            <ArticleCard 
              key={slug} 
              slug={slug} 
              lang={lang}
              rubricSlug={rubricSlug} 
              layout="latest"
              dictionary={dictionary}
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
}