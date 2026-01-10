// src/features/article-display/RandomArticlesSection.tsx
'use client';

import { Dictionary, Lang } from '@/config/i18n';
import RandomArticles from './RandomArticles';

interface RandomArticlesSectionProps {
  lang: Lang;
  dictionary: Dictionary;
  limit?: number;
}

/**
 * Client wrapper for RandomArticles
 * Ensures client-side hydration works properly
 */
export default function RandomArticlesSection({
  lang,
  dictionary,
  limit = 6,
}: RandomArticlesSectionProps) {
  console.log('🎯 RandomArticlesSection rendering');
  
  return (
    <RandomArticles
      lang={lang}
      dictionary={dictionary}
      limit={limit}
    />
  );
}