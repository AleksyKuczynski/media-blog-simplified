// src/main/components/Main/HeroArticles.tsx - CLEANED UP
import { Suspense } from 'react';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import ArticleCard from '../ArticleCards/ArticleCard';

interface HeroArticlesProps {
  heroSlugs: string[];
  lang: Lang;
  rubricSlug?: string;
}

export default function HeroArticles({ heroSlugs, lang, rubricSlug }: HeroArticlesProps) {
  if (heroSlugs.length === 0) {
    return null;
  }

  const [promotedSlug, ...latestSlugs] = heroSlugs;

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading featured articles...</div>}>
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
            lang={lang} 
            rubricSlug={rubricSlug} 
            layout="promoted"
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
              lang={lang} 
              rubricSlug={rubricSlug} 
              layout="latest"
            />
          ))}
        </div>
      </div>
    </Suspense>
  );
}