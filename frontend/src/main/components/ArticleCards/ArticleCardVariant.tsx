// src/main/components/ArticleCards/ArticleCardVariant.tsx
// MIGRATED: Passes new dictionary structure to child components
import { ArticleCardVariantProps } from './interfaces';
import { NewsCard } from './NewsCard';
import { AdvertisingCard } from './AdvertisingCard';
import { StandardCard } from './StandardCard';

/**
 * ArticleCardVariant - MIGRATED to use new dictionary system
 * Passes full dictionary to child components instead of dict.common
 */
export function ArticleCardVariant({
  article,
  articleLink,
  formattedDate,
  imageProps,
  layout = 'regular',
  lang,
  dictionary // MIGRATED: Now uses full dictionary
}: ArticleCardVariantProps) {
  // Choose component based on layout
  const getCardComponent = () => {
    const commonProps = {
      article,
      articleLink,
      dictionary, // MIGRATED: Pass full dictionary
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
  };

  return getCardComponent();
}