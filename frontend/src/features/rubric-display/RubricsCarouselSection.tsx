// src/features/rubric-display/RubricsCarouselSection.tsx

import Section from '@/features/layout/Section';
import CardCarousel from '@/features/shared/CardCarousel/CardCarousel';
import { ActionLink } from '@/shared/primitives/ActionLink';
import { Dictionary, Lang } from '@/config/i18n';
import type { RubricCardData } from '@/features/shared/CardCarousel/types';

interface RubricsCarouselSectionProps {
  cards: RubricCardData[];
  lang: Lang;
  dictionary: Dictionary;
  title: string;
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary';
}

export default function RubricsCarouselSection({
  cards,
  lang,
  dictionary,
  title,
  variant = 'tertiary'
}: RubricsCarouselSectionProps) {
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
        variant="primary"
      >
        {dictionary.sections.home.viewAllRubrics}
      </ActionLink>
    </Section>
  );
}