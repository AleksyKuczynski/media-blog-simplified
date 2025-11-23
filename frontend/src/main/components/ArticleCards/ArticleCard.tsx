// src/main/components/ArticleCards/ArticleCard.tsx  

import { Suspense } from 'react';
import { ArticleCardVariant, ArticleCardSkeletonVariant } from './ArticleCardVariant';
import { getArticleCardData } from '@/main/lib/actions';
import { generateArticleLink, generateArticleLinkAsync } from '@/main/lib/utils';
import { ArticleCardProps } from './interfaces';
import { DIRECTUS_URL } from '@/main/lib/directus';
import { IMAGE_RATIO } from '../mainConstants';

export default async function ArticleCard({ 
  slug, 
  lang, 
  authorSlug, 
  rubricSlug, 
  layout,
  dictionary 
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
    ? generateArticleLink(rubricSlug, slug, lang, translation.local_slug)
    : await generateArticleLinkAsync(slug, lang, authorSlug);

  const cardLayout = layout || article.layout || 'regular';

  const imageProps = article.article_heading_img ? {
    src: `${DIRECTUS_URL}/assets/${article.article_heading_img}`,
    alt: translation.title,
    aspectRatio: IMAGE_RATIO,
  } : null;

  return (
    <Suspense fallback={
      <ArticleCardSkeletonVariant 
        layout={cardLayout}
        showImage={!!article.article_heading_img}
      />
    }>
      <ArticleCardVariant
        article={article}
        formattedDate={formattedDate}
        articleLink={articleLink}
        dictionary={dictionary}
        imageProps={imageProps}
        layout={cardLayout}
        lang={lang}
      />
    </Suspense>
  );
}