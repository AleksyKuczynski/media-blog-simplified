// src/features/article-display/RelatedArticles/RelatedArticles.tsx

import { Dictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchArticleCard, fetchRelatedArticles, DIRECTUS_URL } from '@/api/directus';
import CardCarousel from '../shared/CardCarousel/CardCarousel';
import { ArticleCardData } from '../shared/CardCarousel/types';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  articleCategories: Array<{
    slug: string;
    name: string;
  }>;
  lang: Lang;
  dictionary: Dictionary;
  id?: string;
}

const MINIMUM_ARTICLES = 10;

export default async function RelatedArticles({
  currentArticleSlug,
  articleCategories,
  lang,
  dictionary,
  id,
}: RelatedArticlesProps) {
  
  try {
    // Step 1: Fetch related articles using tiered matching
    const relatedArticles = await fetchRelatedArticles(
      currentArticleSlug,
      articleCategories,
      lang
    );

    let finalArticles = [...relatedArticles];

    // Step 2: If <10 articles, fetch latest to fill up
    if (finalArticles.length < MINIMUM_ARTICLES) {
      const needed = MINIMUM_ARTICLES - finalArticles.length;

      const excludeSlugs = [
        currentArticleSlug,
        ...finalArticles.map(a => a.slug)
      ];

      const { slugs: latestSlugs } = await fetchArticleSlugs(
        1,
        'desc',
        lang,
        undefined,
        undefined,
        excludeSlugs
      );

      if (latestSlugs.length > 0) {
        const latestArticlesPromises = latestSlugs
          .slice(0, needed)
          .map(s => fetchArticleCard(s.slug, lang));

        const latestArticlesData = await Promise.all(latestArticlesPromises);
        
        const latestTransformed = latestArticlesData
          .filter(article => article !== null)
          .map(article => ({
            slug: article!.slug,
            title: article!.translations[0]?.title || '',
            published_at: article!.published_at,
            layout: article!.layout,
            rubric_slug: article!.rubric_slug || '',
            article_heading_img: article!.article_heading_img,
            categories: [],
            matchTier: 3 as const,
            matchCount: 0
          }));

        finalArticles = [...finalArticles, ...latestTransformed];
      }
    }

    // Step 3: Deduplicate
    const seenSlugs = new Set<string>();
    const deduplicatedArticles = finalArticles.filter(article => {
      if (seenSlugs.has(article.slug)) {
        return false;
      }
      seenSlugs.add(article.slug);
      return true;
    });

    if (deduplicatedArticles.length === 0) {
      return null;
    }

    // Step 4: Format for carousel
    const carouselCards: ArticleCardData[] = deduplicatedArticles.map(article => {
      const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const imageSrc = article.article_heading_img 
        ? `${DIRECTUS_URL}/assets/${article.article_heading_img}`
        : undefined;

      return {
        type: 'article',
        slug: article.slug,
        title: article.title,
        publishedAt: article.published_at,
        rubricSlug: article.rubric_slug,
        imageSrc,
        formattedDate,
      };
    });

    // Step 5: Render carousel
    return (
      <>
        <CardCarousel
          cards={carouselCards}
          lang={lang}
          dictionary={dictionary}
        />
      </>
    );

  } catch (error) {
    return null;
  }
}