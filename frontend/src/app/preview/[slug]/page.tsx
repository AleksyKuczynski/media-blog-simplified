// frontend/src/app/preview/[slug]/page.tsx

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function resolveFullPath(slug: string): Promise<string | null> {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;

  try {
    // Must explicitly include draft status — Directus Public role defaults to published only
    const filter = encodeURIComponent(
      JSON.stringify({ slug: { _eq: slug }, status: { _in: ['published', 'draft'] } })
    );
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
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;

  // Set the preview-mode cookie so the article page passes inPreview=true
  // to fetchFullArticle without relying solely on the query param
  const cookieStore = await cookies();
  cookieStore.set('preview-mode', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // No maxAge — session cookie, cleared when browser closes or via /api/preview/exit
  });

  const path = await resolveFullPath(slug);

  if (!path) {
    redirect('/');
  }

  redirect(`${path}?preview=true`);
}