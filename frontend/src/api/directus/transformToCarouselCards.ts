// src/api/directus/transformToCarouselCards.ts

import { Lang } from '@/config/i18n';
import { DIRECTUS_ASSETS_URL } from '../../config/constants/directusConstants';
import { Rubric, AuthorDetails, ArticleSlugInfo } from './directusInterfaces';
import type { ArticleCardData, RubricCardData, AuthorCardData } from '@/features/shared/CardCarousel/types';
import { fetchAllRubrics } from './fetchAllRubrics';
import { fetchAllAuthors } from './fetchAllAuthors';
import { fetchArticleCard } from './fetchArticleCard';
import { getAuthorCarouselAvatarUrl } from '@/features/shared/CardCarousel/carousel.styles';

/**
 * Transform rubrics to carousel card format
 * @param lang - Language code
 * @param limit - Optional limit for number of cards (default: no limit)
 * @returns Array of RubricCardData ready for CardCarousel
 */
export async function transformRubricsToCarousel(
  lang: Lang,
  limit?: number
): Promise<RubricCardData[]> {
  const rubrics = await fetchAllRubrics(lang);
  
  const transformed = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations?.find(t => t.languages_code === lang);
    const iconField = rubric.nav_icon;
    const iconSrc = iconField ? `/api/images/assets/${iconField}` : undefined;

    return {
      type: 'rubric' as const,
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      iconSrc,
      url: `/${lang}/${rubric.slug}`,
      articleCount: rubric.articleCount || 0,
    };
  });

  return limit ? transformed.slice(0, limit) : transformed;
}

/**
 * Transform authors to carousel card format
 * @param lang - Language code
 * @param limit - Optional limit for number of cards (default: no limit)
 * @returns Array of AuthorCardData ready for CardCarousel
 */
export async function transformAuthorsToCarousel(
  lang: Lang,
  limit?: number
): Promise<AuthorCardData[]> {
  const authors = await fetchAllAuthors(lang);
  
  const transformed = authors.map((author: AuthorDetails) => {
const avatarSrc = author.avatar && DIRECTUS_ASSETS_URL
  ? getAuthorCarouselAvatarUrl(DIRECTUS_ASSETS_URL, author.avatar)
  : undefined;

    return {
      type: 'author' as const,
      slug: author.slug,
      name: author.name,
      count: author.articleCount || 0,
      avatarSrc,
      url: `/${lang}/authors/${author.slug}`,
    };
  });

  return limit ? transformed.slice(0, limit) : transformed;
}

/**
 * Transform article slugs to carousel card format
 * @param slugInfos - Array of article slug info
 * @param lang - Language code
 * @returns Array of ArticleCardData ready for CardCarousel
 */
export async function transformArticlesToCarousel(
  slugInfos: ArticleSlugInfo[],
  lang: Lang
): Promise<ArticleCardData[]> {
  // Fetch all article cards in parallel
  const articlePromises = slugInfos.map(slugInfo => 
    fetchArticleCard(slugInfo.slug, lang)
  );
  
  const articles = await Promise.all(articlePromises);
  
  // Filter out null results and transform
  return articles
    .filter(article => article !== null)
    .map(article => {
      const formattedDate = new Date(article!.published_at).toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const imageSrc = article!.article_heading_img 
        ? `${DIRECTUS_ASSETS_URL}/assets/${article!.article_heading_img}`
        : undefined;

      return {
        type: 'article' as const,
        slug: article!.slug,
        title: article!.translations[0]?.title || '',
        publishedAt: article!.published_at,
        rubricSlug: article!.rubric_slug || '',
        imageSrc,
        formattedDate,
      };
    });
}