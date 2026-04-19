// src/main/components/ArticleCards/ArticleCardVariant.tsx

import { ArticleCardVariantProps } from './interfaces';
import { NewsCard } from './NewsCard';
import { AdvertisingCard } from './AdvertisingCard';
import { StandardCard } from './StandardCard';
import { NewsCardSkeleton } from './NewsCardSkeleton';
import { AdvertisingCardSkeleton } from './AdvertisingCardSkeleton';
import { StandardCardSkeleton } from './StandardCardSkeleton';

// Skeleton variant router
export function ArticleCardSkeletonVariant({ 
  layout = 'regular',
  showImage = true 
}: { 
  layout?: string;
  showImage?: boolean;
}) {
  switch (layout) {
    case 'news':
      return <NewsCardSkeleton />;
    case 'advertising':
      return <AdvertisingCardSkeleton />;
    default:
      return <StandardCardSkeleton 
        layout={layout as 'regular' | 'promoted' | 'latest'}
        showImage={showImage}
      />;
  }
}

// Main component variant router (unchanged)
export function ArticleCardVariant({
  article,
  articleLink,
  formattedDate,
  imageProps,
  layout = 'regular',
  lang,
  dictionary,
  fromContext
}: ArticleCardVariantProps) {
  const commonProps = {
    article,
    articleLink,
    fromContext,
    dictionary,
    lang
  };

  switch (layout) {
    case 'news':
      return <NewsCard 
        {...commonProps}
        formattedDate={formattedDate}
      />;
    case 'advertising':
      return <AdvertisingCard {...commonProps} />;
    default:
      return <StandardCard
        {...commonProps}
        formattedDate={formattedDate}
        imageProps={imageProps}
        layout={layout}
      />;
  }
}