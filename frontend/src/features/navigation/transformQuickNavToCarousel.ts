// src/features/navigation/transformQuickNavToCarousel.ts

import { Lang, Dictionary } from '@/config/i18n';

/**
 * Navigation link card data for carousel display
 * Uses a simplified structure compatible with CardCarousel
 */
export interface NavLinkCardData {
  type: 'navlink';
  slug: string;
  name: string;
  description?: string;
  url: string;
}

/**
 * Transform quick navigation items to carousel card format
 * Creates simple navigation cards for articles, rubrics, authors pages
 * 
 * @param lang - Language code
 * @param dictionary - Dictionary for labels
 * @returns Array of NavLinkCardData ready for display
 */
export function transformQuickNavToCards(
  lang: Lang,
  dictionary: Dictionary
): NavLinkCardData[] {
  return [
    {
      type: 'navlink' as const,
      slug: 'articles',
      name: dictionary.sections.labels.articles,
      description: dictionary.navigation.descriptions.articles,
      url: `/${lang}/articles`,
    },
    {
      type: 'navlink' as const,
      slug: 'rubrics',
      name: dictionary.sections.labels.rubrics,
      description: dictionary.navigation.descriptions.rubrics,
      url: `/${lang}/rubrics`,
    },
    {
      type: 'navlink' as const,
      slug: 'authors',
      name: dictionary.sections.labels.authors,
      description: dictionary.navigation.descriptions.authors,
      url: `/${lang}/authors`,
    },
  ];
}