// src/main/components/ArticleCards/ArticleCard.tsx
// MIGRATED: Uses new dictionary system and accepts dictionary prop
import { Suspense } from 'react';
import { ArticleCardVariant } from './ArticleCardVariant';
import { getArticleCardData } from '@/main/lib/actions';
import { generateArticleLink, generateArticleLinkAsync } from '@/main/lib/utils';
import { ArticleCardProps } from './interfaces';
import { DIRECTUS_URL } from '@/main/lib/directus';
import { IMAGE_RATIO } from '../mainConstants';

/**
 * ArticleCard - MIGRATED to new dictionary system
 * Now properly accepts dictionary prop and passes it to child components
 */
export default async function ArticleCard({ 
  slug, 
  lang, 
  authorSlug, 
  rubricSlug, 
  layout,
  dictionary // MIGRATED: Now properly used
}: ArticleCardProps) {
  const article = await getArticleCardData(slug, lang);

  if (!article || !article.translations[0]) {
    return null;
  }

  const translation = article.translations[0];
  const formattedDate = new Date(article.published_at).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const articleLink = rubricSlug
    ? generateArticleLink(rubricSlug, slug, lang)
    : await generateArticleLinkAsync(slug, lang, authorSlug);

  const cardLayout = layout || article.layout || 'regular';

  const imageProps = article.article_heading_img ? {
    src: `${DIRECTUS_URL}/assets/${article.article_heading_img}`,
    alt: translation.title,
    aspectRatio: IMAGE_RATIO,
  } : null;

  return (
    <Suspense fallback={
      <div className="p-4 animate-pulse bg-sf-hi rounded-xl">
        {dictionary.common.loading}
      </div>
    }>
      <ArticleCardVariant
        article={article}
        formattedDate={formattedDate}
        articleLink={articleLink}
        dictionary={dictionary}  // MIGRATED: Pass full dictionary
        imageProps={imageProps}
        layout={cardLayout}
        lang={lang}
      />
    </Suspense>
  );
}