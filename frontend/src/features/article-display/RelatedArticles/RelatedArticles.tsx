// src/main/components/Article/RelatedArticles/RelatedArticles.tsx

import { Dictionary, Lang } from '@/config/i18n';
import { fetchArticleSlugs, fetchArticleCard, fetchRelatedArticles, DIRECTUS_URL } from '@/api/directus';
import RelatedArticlesCarousel, { CarouselArticle } from './RelatedArticlesCarousel';
import { RELATED_ARTICLES_STYLES } from './styles';

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

/**
 * RelatedArticles - Production version with carousel
 * 
 * Algorithm:
 * 1. Fetch related articles using tiered category matching
 * 2. If <10 articles found, add latest articles to reach minimum
 * 3. Deduplicate results
 * 4. Format for carousel display
 * 5. Render in carousel component
 * 
 * Error handling: Returns null (component doesn't render) on error
 */
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

      // Collect slugs to exclude (current article + already found articles)
      const excludeSlugs = [
        currentArticleSlug,
        ...finalArticles.map(a => a.slug)
      ];

      // Fetch latest article slugs excluding already found ones
      const { slugs: latestSlugs } = await fetchArticleSlugs(
        1, // page 1
        'desc', // newest first
        lang,
        undefined, // no category filter
        undefined, // no search
        excludeSlugs // exclude current and found articles
      );

      // Fetch full article card data for latest articles using fetchArticleCard
      if (latestSlugs.length > 0) {
        const latestArticlesPromises = latestSlugs
          .slice(0, needed)
          .map(s => fetchArticleCard(s.slug, lang));

        const latestArticlesData = await Promise.all(latestArticlesPromises);
        
        // Filter out any null results and transform to RelatedArticleInfo format
        const latestTransformed = latestArticlesData
          .filter(article => article !== null)
          .map(article => ({
            slug: article!.slug,
            title: article!.translations[0]?.title || '',
            published_at: article!.published_at,
            layout: article!.layout,
            rubric_slug: article!.rubric_slug || '',
            article_heading_img: article!.article_heading_img,
            categories: [], // Latest articles don't need category info
            matchTier: 3 as 1 | 2 | 3, // Assign to Tier 3 (lowest priority)
            matchCount: 0
          }));

        // Append to end (after all tiered articles)
        finalArticles = [...finalArticles, ...latestTransformed];
      }
    }

    // Step 3: Deduplicate (shouldn't be needed, but safety check)
    const seenSlugs = new Set<string>();
    const deduplicatedArticles = finalArticles.filter(article => {
      if (seenSlugs.has(article.slug)) {
        return false;
      }
      seenSlugs.add(article.slug);
      return true;
    });

    // Don't render if no articles found (error case)
    if (deduplicatedArticles.length === 0) {
      return null;
    }

    // Step 4: Format for carousel
    const carouselArticles: CarouselArticle[] = deduplicatedArticles.map(article => {
      const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Construct full image URL in server component
      const imageSrc = article.article_heading_img 
        ? `${DIRECTUS_URL}/assets/${article.article_heading_img}`
        : undefined;

      return {
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
      <section 
        id={id}
        className={RELATED_ARTICLES_STYLES.section}
        aria-label={dictionary.sections.rubrics.readMoreAbout}
      >
        <h2 className={RELATED_ARTICLES_STYLES.heading}>
          {dictionary.sections.rubrics.readMoreAbout}
        </h2>

        <RelatedArticlesCarousel
          articles={carouselArticles}
          lang={lang}
        />
      </section>
    );

  } catch (error) {
    return null; // Don't render on error
  }
}