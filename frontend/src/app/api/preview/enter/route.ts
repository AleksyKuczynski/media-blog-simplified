// frontend/src/app/api/preview/enter/route.ts

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

/**
 * Resolve article URL path from slug.
 * Queries Directus for rubric_slug and available translations,
 * then picks the best language (prefers 'ru', falls back to first available).
 */
async function resolveArticlePath(slug: string): Promise<string | null> {
  try {
    const filter = encodeURIComponent(JSON.stringify({ slug: { _eq: slug } }));
    const fields = 'slug,rubric_slug.slug,translations.languages_code';
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=${fields}&limit=1`;

    const headers: HeadersInit = {};
    if (PREVIEW_SECRET) {
      headers['Authorization'] = `Bearer ${PREVIEW_SECRET}`;
    }

    const response = await fetch(url, { cache: 'no-store', headers });
    if (!response.ok) return null;

    const data = await response.json();
    const article = data.data?.[0];
    if (!article) return null;

    const rubric = article.rubric_slug?.slug;
    if (!rubric) return null;

    const langs: string[] = (article.translations ?? []).map((t: any) => t.languages_code);
    // Prefer 'ru', then 'en', then first available
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
  // Also support explicit redirect= for flexibility
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

  // Serve an HTML page that sets the cookie client-side then navigates.
  // A plain 302 redirect causes browsers to silently drop Set-Cookie
  // headers when the response is inside a cross-origin iframe (Directus → Vercel).
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=${safePath}" />
  </head>
  <body>
    <script>
      document.cookie = "preview-mode=true; path=/; max-age=3600; SameSite=None; Secure";
      window.location.replace(${JSON.stringify(safePath)});
    </script>
  </body>
</html>`;

  const directusUrl = process.env.DIRECTUS_URL || 'https://cms.event4me.blog';

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': `preview-mode=true; Path=/; Max-Age=3600; SameSite=None; Secure; HttpOnly`,
      // Allow this page to load inside the Directus iframe
      'Content-Security-Policy': `frame-ancestors 'self' ${directusUrl}`,
      // Override Vercel's default X-Frame-Options: SAMEORIGIN
      'X-Frame-Options': 'ALLOWALL',
    },
  });
}