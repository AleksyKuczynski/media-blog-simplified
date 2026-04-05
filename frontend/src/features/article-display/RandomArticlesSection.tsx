// src/features/article-display/RandomArticlesSection.tsx

import { Dictionary, Lang } from '@/config/i18n';
import Section from '@/features/layout/Section';
import CardCarousel from '../shared/CardCarousel/CardCarousel';
import { ActionLink } from '@/shared/primitives/ActionLink';
import { ArticleCardData } from '@/features/shared/CardCarousel/types';

import { DIRECTUS_URL, DIRECTUS_ASSETS_URL } from '@/api/directus';

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
  if (!DIRECTUS_URL) return null;

  try {
    const fetchLimit = Math.min(limit * 3, 18);
    const params = new URLSearchParams({
      fields: 'slug,published_at,layout,rubric_slug,article_heading_img,translations.title,translations.languages_code',
      filter: JSON.stringify({ status: { _eq: 'published' } }),
      deep: JSON.stringify({ translations: { _filter: { languages_code: { _eq: lang } } } }),
      sort: '-published_at',
      limit: fetchLimit.toString(),
    });

    const response = await fetch(`${DIRECTUS_URL}/items/articles?${params}`, {
      next: { revalidate: 3600, tags: ['articles'] },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const articles = (data.data ?? []).filter((a: any) => a.translations?.length > 0);

    // Deterministic shuffle using published_at as seed — stable per revalidation cycle
    const shuffled = [...articles].sort((a, b) =>
      new Date(a.published_at).getTime() % 7 - new Date(b.published_at).getTime() % 7
    );
    const selected = shuffled.slice(0, limit);

    const cards: ArticleCardData[] = selected.map((a: any) => {
      const translation = a.translations.find((t: any) => t.languages_code === lang);
      return {
        type: 'article' as const,
        slug: a.slug,
        title: translation?.title ?? '',
        publishedAt: a.published_at,
        imageSrc: a.article_heading_img ? `${DIRECTUS_ASSETS_URL}/assets/${a.article_heading_img}` : undefined,
        rubricSlug: a.rubric_slug ?? '',
        formattedDate: new Date(a.published_at).toLocaleDateString(lang, {
          year: 'numeric', month: 'long', day: 'numeric',
        }),
      };
    });

    if (!cards.length) return null;

    return (
      <Section title={title} titleLevel="h2" variant={variant} hasNextSectionTitle={true}>
        <CardCarousel cards={cards} lang={lang} dictionary={dictionary} />
        <ActionLink href={`/${lang}/articles`} variant={variant}>
          {dictionary.sections.home.viewAllArticles}
        </ActionLink>
      </Section>
    );
  } catch {
    return null;
  }
}