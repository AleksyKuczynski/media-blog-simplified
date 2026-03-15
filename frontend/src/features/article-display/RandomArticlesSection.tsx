// src/features/article-display/RandomArticlesSection.tsx

import { Dictionary, Lang } from '@/config/i18n';
import Section from '@/features/layout/Section';
import CardCarousel from '../shared/CardCarousel/CardCarousel';
import { ActionLink } from '@/shared/primitives/ActionLink';
import { getRandomArticles } from './actions/getRandomArticles';

interface RandomArticlesSectionProps {
  lang: Lang;
  dictionary: Dictionary;
  title: string;
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
  limit?: number;
}

export default async function RandomArticlesSection({
  lang,
  dictionary,
  title,
  variant = 'tertiary',
  limit = 6,
}: RandomArticlesSectionProps) {
  let cards;
  try {
    cards = await getRandomArticles(lang, limit);
  } catch (error) {
    console.error('Error fetching random articles:', error);
    return null;
  }

  if (!cards.length) {
    return null;
  }

  return (
    <Section 
      title={title}
      titleLevel="h2"
      variant={variant}
      hasNextSectionTitle={true}
    >
      <CardCarousel
        cards={cards}
        lang={lang}
        dictionary={dictionary}
      />

      <ActionLink 
        href={`/${lang}/articles`}
        variant='secondary'
      >
        {dictionary.sections.home.viewAllArticles}
      </ActionLink>
    </Section>
  );
}