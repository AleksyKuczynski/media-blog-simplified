// src/features/article-display/RandomArticlesSection.tsx

import { Dictionary, Lang } from '@/config/i18n';
import CardCarousel from '../shared/CardCarousel/CardCarousel';
import { getRandomArticles } from './actions/getRandomArticles';

interface RandomArticlesSectionProps {
  lang: Lang;
  dictionary: Dictionary;
  limit?: number;
}

export default async function RandomArticlesSection({
  lang,
  dictionary,
  limit = 6,
}: RandomArticlesSectionProps) {
  const cards = await getRandomArticles(lang, limit);

  if (cards.length === 0) {
    return null;
  }

  return (
    <CardCarousel
      cards={cards}
      lang={lang}
      dictionary={dictionary}
    />
  );
}