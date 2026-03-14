// frontend/src/app/preview/[slug]/page.tsx

import { redirect } from 'next/navigation';
import { resolveArticleSlug } from '@/api/directus';
import { DEFAULT_LANG, SUPPORTED_LANGUAGES } from '@/config/constants/constants';
import { Lang } from '@/config/i18n';

// Fetch rubric for slug — reuse existing Directus query pattern
async function resolveFullPath(slug: string): Promise<string | null> {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;

  try {
    const filter = encodeURIComponent(JSON.stringify({ slug: { _eq: slug } }));
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=slug,rubric_slug,translations.languages_code&limit=1`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = await res.json();
    const article = data.data?.[0];
    if (!article) return null;

    const rubric = article.rubric_slug?.slug ?? article.rubric_slug;
    if (!rubric) return null;

    const langs: string[] = (article.translations ?? []).map((t: any) => t.languages_code);
    const lang = langs.includes('ru') ? 'ru' : langs.includes('en') ? 'en' : langs[0];
    if (!lang) return null;

    return `/${lang}/${rubric}/${slug}`;
  } catch {
    return null;
  }
}

export default async function PreviewRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;

  const path = await resolveFullPath(slug);

  if (!path) {
    redirect('/');
  }

  redirect(`${path}?preview=true`);
}