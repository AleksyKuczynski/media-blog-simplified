// src/main/components/Article/RelatedArticles/RelatedArticles.tsx
// PHASE 2A: Production version with carousel display

import { Dictionary } from '@/main/lib/dictionary';
import { fetchRelatedArticles } from '@/main/lib/directus/fetchRelatedArticles';
import { fetchArticleSlugs, fetchArticleCard, DIRECTUS_URL } from '@/main/lib/directus';
import RelatedArticlesCarousel, { CarouselArticle } from './RelatedArticlesCarousel';

interface RelatedArticlesProps {
  currentArticleSlug: string;
  articleCategories: Array<{
    slug: string;
    name: string;
  }>;
  lang: 'ru';
  dictionary: Dictionary;
  className?: string;
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
  className = "mt-12 pt-8 border-t border-gray-200"
}: RelatedArticlesProps) {
  
  try {
    // Step 1: Fetch related articles using tiered matching
    const relatedArticles = await fetchRelatedArticles(
      currentArticleSlug,
      articleCategories,
      lang
    );

    console.log('RelatedArticles: Found', relatedArticles.length, 'related articles');

    let finalArticles = [...relatedArticles];

    // Step 2: If <10 articles, fetch latest to fill up
    if (finalArticles.length < MINIMUM_ARTICLES) {
      const needed = MINIMUM_ARTICLES - finalArticles.length;
      console.log('RelatedArticles: Need', needed, 'more articles to reach minimum');

      // Collect slugs to exclude (current article + already found articles)
      const excludeSlugs = [
        currentArticleSlug,
        ...finalArticles.map(a => a.slug)
      ];

      // Fetch latest article slugs excluding already found ones
      const { slugs: latestSlugs } = await fetchArticleSlugs(
        1, // page 1
        'desc', // newest first
        undefined, // no category filter
        undefined, // no search
        excludeSlugs // exclude current and found articles
      );

      console.log('RelatedArticles: Found', latestSlugs.length, 'latest article slugs');

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
        console.log('RelatedArticles: Added', latestTransformed.length, 'latest articles');
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

    console.log('RelatedArticles: Final count after deduplication:', deduplicatedArticles.length);

    // Don't render if no articles found (error case)
    if (deduplicatedArticles.length === 0) {
      console.log('RelatedArticles: No articles to display');
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
        rubricSlug: article.rubric_slug || 'articles', // Fallback to 'articles' if no rubric
        imageSrc, // Full URL, not just ID
        formattedDate,
      };
    });

    // Step 5: Render carousel
    return (
      <section 
        className={className}
        aria-label={dictionary.sections.rubrics.readMoreAbout || "Related articles"}
      >
        <h2 className="text-2xl font-bold mb-6 text-on-sf">
          {dictionary.sections.rubrics.readMoreAbout || "Read more"}
        </h2>

        <RelatedArticlesCarousel
          articles={carouselArticles}
          lang={lang}
        />

        {/* Debug info - can be removed later */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-on-sf-var">
            Showing {carouselArticles.length} articles
            {finalArticles.length < MINIMUM_ARTICLES && 
              ` (including ${finalArticles.length - relatedArticles.length} latest articles)`
            }
          </div>
        )}
      </section>
    );

  } catch (error) {
    console.error('Error in RelatedArticles:', error);
    return null; // Don't render on error
  }
}