import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'ru';
  const limit = parseInt(searchParams.get('limit') || '6', 10);

  if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  try {
    const fetchLimit = Math.min(limit * 3, 18);
    
    const params = new URLSearchParams({
      fields: 'slug,published_at,layout,rubric_slug,article_heading_img,translations.title,translations.languages_code',
      filter: JSON.stringify({
        status: { _eq: 'published' }
      }),
      deep: JSON.stringify({
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }),
      sort: '-published_at',
      limit: fetchLimit.toString()
    });

    const url = `${DIRECTUS_URL}/items/articles?${params}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch articles' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const articles = data.data || [];

    const shuffled = [...articles].sort(() => Math.random() - 0.5);
    const randomArticles = shuffled.slice(0, limit);

    return NextResponse.json({
      data: randomArticles,
      total: randomArticles.length
    });

  } catch (error) {
    console.error('Random articles API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}