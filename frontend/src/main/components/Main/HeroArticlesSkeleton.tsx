// src/main/components/Main/HeroArticlesSkeleton.tsx

import { HERO_ARTICLES_SKELETON_STYLES } from './HeroArticles';
import { ArticleCardSkeletonVariant } from '../ArticleCards/ArticleCardVariant';

interface HeroArticlesSkeletonProps {
  latestCount?: number;
}

export function HeroArticlesSkeleton({ 
  latestCount = 3 
}: HeroArticlesSkeletonProps) {
  return (
    <div 
      className={HERO_ARTICLES_SKELETON_STYLES.container}
      role="status"
      aria-label="Loading featured articles..."
    >
      {/* Promoted Article Skeleton */}
      <div className={HERO_ARTICLES_SKELETON_STYLES.promoted.wrapper}>
        <ArticleCardSkeletonVariant 
          layout="promoted"
          showImage={true}
        />
      </div>
      
      {/* Latest Articles Grid Skeleton */}
      <div className={HERO_ARTICLES_SKELETON_STYLES.latest.wrapper}>
        {Array.from({ length: latestCount }, (_, index) => (
          <ArticleCardSkeletonVariant 
            key={index}
            layout="latest"
            showImage={true}
          />
        ))}
      </div>
      
      <span className="sr-only">Loading featured articles...</span>
    </div>
  );
}