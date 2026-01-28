// src/features/author-display/AuthorsCarouselSection.tsx

import Section from '@/features/layout/Section';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import { ActionLink } from '@/shared/primitives/ActionLink';
import { Dictionary, Lang } from '@/config/i18n';
import { transformAuthorsToCarousel } from '@/api/directus/transformToCarouselCards';

interface AuthorsCarouselSectionProps {
  lang: Lang;
  dictionary: Dictionary;
  title: string;
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
  limit?: number;
}

export default async function AuthorsCarouselSection({
  lang,
  dictionary,
  title,
  variant = 'tertiary',
  limit = 6
}: AuthorsCarouselSectionProps) {
  let cards;
  try {
    cards = await transformAuthorsToCarousel(lang, limit);
  } catch (error) {
    console.error('Error fetching authors:', error);
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
        href={`/${lang}/authors`}
        variant={variant}
      >
        {dictionary.sections.authors.allAuthors}
      </ActionLink>
    </Section>
  );
}