// app/api/random-articles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DIRECTUS_URL } from '@/api/directus';

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'en';
    const limit = parseInt(searchParams.get('limit') || '6');

    const fields = [
      'slug',
      'published_at',
      'layout',
      'rubric_slug',
      'article_heading_img',
      'translations.title',
      'translations.languages_code',
    ].join(',');

    const filter = {
      status: { _eq: 'published' },
      translations: {
        languages_code: { _eq: lang }
      }
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    
    // Directus uses ? for random sort
    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${encodedFilter}&sort=?&limit=${limit}`;

    const response = await fetch(url, {
      headers: DIRECTUS_API_TOKEN
        ? { Authorization: `Bearer ${DIRECTUS_API_TOKEN}` }
        : {},
      cache: 'no-store', // Never cache - always random
    });

    if (!response.ok) {
      console.error('Failed to fetch random articles:', response.status);
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const data = await response.json();
    
    return NextResponse.json({ data: data.data || [] });
    
  } catch (error) {
    console.error('Error in random-articles API:', error);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}