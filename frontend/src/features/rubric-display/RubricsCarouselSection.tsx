// src/features/rubric-display/RubricsCarouselSection.tsx

import Section from '@/features/layout/Section';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import { ActionLink } from '@/shared/primitives/ActionLink';
import { Dictionary, Lang } from '@/config/i18n';
import { transformRubricsToCarousel } from '@/api/directus/transformToCarouselCards';

interface RubricsCarouselSectionProps {
  lang: Lang;
  dictionary: Dictionary;
  title: string;
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
  limit?: number;
}

export default async function RubricsCarouselSection({
  lang,
  dictionary,
  title,
  variant = 'tertiary',
  limit = 6
}: RubricsCarouselSectionProps) {
  let cards;
  try {
    cards = await transformRubricsToCarousel(lang, limit);
  } catch (error) {
    console.error('Error fetching rubrics:', error);
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
        href={`/${lang}/rubrics`}
        variant={variant}
      >
        {dictionary.sections.home.viewAllRubrics}
      </ActionLink>
    </Section>
  );
}