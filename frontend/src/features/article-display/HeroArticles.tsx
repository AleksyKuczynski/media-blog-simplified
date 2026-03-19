// src/features/article-display/HeroArticles.tsx

import { Suspense } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import Section from '@/features/layout/Section';
import { ActionLink } from '@/shared/primitives/ActionLink';
import ArticleCard from './ArticleCard';
import { HeroArticlesSkeleton } from './HeroArticlesSkeleton';
import { HERO_ARTICLES_STYLES } from './articles.styles';
import { fetchHeroSlugs } from '@/api/directus';

interface HeroArticlesProps {
  lang: Lang;
  dictionary: Dictionary;
  rubricSlug?: string;
}

async function HeroArticlesContent({ lang, dictionary, rubricSlug }: HeroArticlesProps) {
  let slugs: string[] = [];
  
  try {
    slugs = await fetchHeroSlugs(lang);
  } catch (error) {
    console.error('Error fetching hero articles:', error);
    return null;
  }

  if (slugs.length === 0) {
    return (
      <div className={HERO_ARTICLES_STYLES.empty}>
        {dictionary.sections.articles.noFeaturedArticles}
      </div>
    );
  }

  const [promotedSlug, ...latestSlugs] = slugs;

  return (
    <>
      <div className={HERO_ARTICLES_STYLES.container}>
        {/* Promoted Article */}
        <div className={HERO_ARTICLES_STYLES.promoted.wrapper}>
          <ArticleCard 
            slug={promotedSlug} 
            lang={lang}
            rubricSlug={rubricSlug} 
            layout="promoted"
            dictionary={dictionary}
            fromContext="home"
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
              fromContext="home"
            />
          ))}
        </div>
      </div>

      <ActionLink 
        href={`/${lang}/articles`}
      >
        {dictionary.sections.home.viewAllArticles}
      </ActionLink>
    </>
  );
}

export default function HeroArticles({ lang, dictionary, rubricSlug }: HeroArticlesProps) {
  return (
    <Section 
      title={dictionary.sections.home.featuredContent}
      titleLevel="h2"
      variant="default"
      hasNextSectionTitle={true}
    >
      <Suspense fallback={<HeroArticlesSkeleton latestCount={3} />}>
        <HeroArticlesContent 
          lang={lang}
          dictionary={dictionary}
          rubricSlug={rubricSlug}
        />
      </Suspense>
    </Section>
  );
}