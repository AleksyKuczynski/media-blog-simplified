// frontend/src/app/api/preview/enter/route.ts

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'https://cms.event4me.blog';

async function resolveArticlePath(slug: string): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({
      slug: { _eq: slug },
    }));
    const fields = 'slug,rubric_slug.slug,translations.languages_code';
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=${fields}&limit=1`;

    const headers: HeadersInit = {
      'Authorization': `Bearer ${process.env.PREVIEW_SECRET}`,
    };

    const response = await fetch(url, { cache: 'no-store', headers });
    if (!response.ok) return null;

    const data = await response.json();
    const article = data.data?.[0];
    if (!article) return null;

    // rubric_slug is M2O — Directus may return object or plain string
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const slugParam = searchParams.get('slug');
  const redirectParam = searchParams.get('redirect');

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  let safePath: string;

  if (redirectParam) {
    safePath = redirectParam.startsWith('/') ? redirectParam : '/';
  } else if (slugParam) {
    const resolved = await resolveArticlePath(slugParam);
    safePath = resolved ?? '/';
  } else {
    safePath = '/';
  }

  const previewPath = safePath + (safePath.includes('?') ? '&' : '?') + 'preview=true';

  return NextResponse.redirect(new URL(previewPath, request.url), {
    status: 302,
    headers: {
      'Content-Security-Policy': `frame-ancestors 'self' ${DIRECTUS_URL}`,
    },
  });
}