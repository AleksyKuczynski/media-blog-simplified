// src/main/components/Main/HeroArticles.tsx

import { Suspense } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import ArticleCard from './ArticleCard';
import { HeroArticlesSkeleton } from './HeroArticlesSkeleton';
import { HERO_ARTICLES_STYLES } from './styles';

interface HeroArticlesProps {
  slugs: string[];
  lang: Lang;
  dictionary: Dictionary;
  rubricSlug?: string;
}



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