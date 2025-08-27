// src/main/components/ArticleCards/ArticleCardVariant.tsx - CLEANED UP
import { ArticleCardVariantProps } from './interfaces';
import { NewsCard } from './NewsCard';
import { AdvertisingCard } from './AdvertisingCard';
import { StandardCard } from './StandardCard';

export function ArticleCardVariant({
  article,
  articleLink,
  formattedDate,
  imageProps,
  layout = 'regular',
  lang,
  dict
}: ArticleCardVariantProps) {
  // Choose component based on layout - no more theme dependencies
  const getCardComponent = () => {
    const commonProps = {
      article,
      articleLink,
      dict
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
          lang={lang}
        />;
    }
  };

  return getCardComponent();
}