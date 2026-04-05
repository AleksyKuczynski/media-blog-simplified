// src/api/directus/fetchStaticArticlePaths.ts
import { SUPPORTED_LANGUAGES } from '@/config/constants/constants';
import { DIRECTUS_URL } from '@/config/constants/directusConstants';
import type { Lang } from '@/config/i18n';

interface StaticArticlePath {
  lang: Lang;
  rubric: string;
  slug: string;
}

export async function fetchStaticArticlePaths(): Promise<StaticArticlePath[]> {
  try {
    const filter = encodeURIComponent(JSON.stringify({ status: { _eq: 'published' } }));
    const fields = 'slug,rubric_slug,translations.languages_code,translations.local_slug';
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=${fields}&limit=-1`;

    const response = await fetch(url, { next: { revalidate: 3600, tags: ['articles'] } });
    if (!response.ok) return [];

    const data = await response.json();
    const articles: any[] = data.data ?? [];

    const paths: StaticArticlePath[] = [];

    for (const article of articles) {
      const rubric = article.rubric_slug;
      if (!rubric) continue;

      for (const lang of SUPPORTED_LANGUAGES) {
        const translation = (article.translations ?? []).find(
          (t: any) => t.languages_code === lang
        );
        if (!translation) continue;

        // Emit local_slug path if present (this is what URLs use)
        const urlSlug = translation.local_slug || article.slug;
        paths.push({ lang, rubric, slug: urlSlug });

        // Also emit main slug if different (so resolveArticleSlug finds it)
        if (translation.local_slug && translation.local_slug !== article.slug) {
          paths.push({ lang, rubric, slug: article.slug });
        }
      }
    }

    return paths;
  } catch {
    return [];
  }
}