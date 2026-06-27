import { NextRequest, NextResponse } from 'next/server';
import { DIRECTUS_URL, DIRECTUS_ASSETS_URL } from '@/config/constants/directusConstants';
import { SITE_URL } from '@/config/constants/constants';

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export const revalidate = 3600;

const CHANNEL_META = {
  en: {
    title: 'EventForMe — Wedding Blog',
    description: 'Stylish ideas, planning guides, and trends for weddings and events.',
    language: 'en',
  },
  ru: {
    title: 'EventForMe — Свадебный блог',
    description: 'Стильные идеи, советы по планированию и тренды для свадеб и мероприятий.',
    language: 'ru',
  },
} as const;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  const safeLang = lang === 'ru' || lang === 'en' ? (lang as 'ru' | 'en') : 'ru';

  if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN) {
    return new NextResponse('Server configuration error', { status: 500 });
  }

  try {
    const fields = [
      'slug',
      'published_at',
      'rubric_slug.slug',
      'article_heading_img',
      'translations.title',
      'translations.description',
      'translations.lead',
      'translations.local_slug',
      'translations.languages_code',
    ].join(',');

    const filter = encodeURIComponent(JSON.stringify({ status: { _eq: 'published' } }));
    const deep = encodeURIComponent(
      JSON.stringify({ translations: { _filter: { languages_code: { _eq: safeLang } } } }),
    );

    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${filter}&deep=${deep}&sort=-published_at&limit=50`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return new NextResponse('Failed to fetch articles', { status: 502 });
    }

    const { data: articles } = await res.json();
    const meta = CHANNEL_META[safeLang];
    const channelUrl = `${SITE_URL}/${safeLang}`;
    const feedUrl = `${SITE_URL}/${safeLang}/feed.xml`;
    const buildDate = articles?.[0]?.published_at
      ? new Date(articles[0].published_at).toUTCString()
      : new Date().toUTCString();

    const items = (articles ?? [])
      .map((article: any) => {
        const translation = article.translations?.[0];
        if (!translation?.title) return '';

        const rubricSlug = article.rubric_slug?.slug || '';
        const articleSlug = translation.local_slug || article.slug;
        const articleUrl = `${SITE_URL}/${safeLang}/${rubricSlug}/${articleSlug}`;
        const description = translation.description || translation.lead || '';
        const pubDate = article.published_at
          ? new Date(article.published_at).toUTCString()
          : '';
        const enclosure = article.article_heading_img
          ? `\n      <enclosure url="${DIRECTUS_ASSETS_URL}/assets/${article.article_heading_img}?width=1200&amp;height=630&amp;fit=cover" type="image/jpeg" length="0" />`
          : '';

        return `    <item>
      <title>${escapeXml(translation.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>${enclosure}
    </item>`;
      })
      .filter(Boolean)
      .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${channelUrl}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('[feed.xml] RSS generation failed:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
