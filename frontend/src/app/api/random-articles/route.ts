// app/api/random-articles/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { DIRECTUS_URL } from '@/api/directus';

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function GET(request: NextRequest) {
  console.log('\n=== RANDOM ARTICLES API START ===');
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get('lang') || 'ru';
    const limit = parseInt(searchParams.get('limit') || '6');

    console.log('Request params:', { lang, limit });
    console.log('DIRECTUS_URL:', DIRECTUS_URL);
    console.log('Has DIRECTUS_API_TOKEN:', !!DIRECTUS_API_TOKEN);

    const fields = [
      'slug',
      'published_at',
      'layout',
      'rubric_slug',
      'article_heading_img',
      'translations.title',
      'translations.languages_code',
    ].join(',');

    // Main filter - only status
    const filter = {
      status: { _eq: 'published' }
    };

    // Deep filter for translations language
    const deepFilter = {
      translations: {
        _filter: {
          languages_code: { _eq: lang }
        }
      }
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    const encodedDeepFilter = encodeURIComponent(JSON.stringify(deepFilter));
    
    // Fetch MORE articles than needed (3x) so we can randomize
    const fetchLimit = limit * 3;
    
    // Build URL WITHOUT sort parameter - fetch by published date
    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${encodedFilter}&deep=${encodedDeepFilter}&sort=-published_at&limit=${fetchLimit}`;

    console.log('Full URL:', url);

    const headers = DIRECTUS_API_TOKEN
      ? { 'Authorization': `Bearer ${DIRECTUS_API_TOKEN}` }
      : {};

    const fetchStart = Date.now();
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });
    const fetchDuration = Date.now() - fetchStart;

    console.log('Response status:', response.status);
    console.log('Fetch duration:', fetchDuration, 'ms');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Directus error response:', errorText);
      console.log('=== RANDOM ARTICLES API END (ERROR) ===\n');
      return NextResponse.json({ data: [], error: errorText }, { status: 200 });
    }

    const data = await response.json();
    const articles = data.data || [];
    
    console.log('Fetched', articles.length, 'articles');
    
    // Randomize the array using Fisher-Yates shuffle
    const shuffled = [...articles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Take only the requested number
    const randomArticles = shuffled.slice(0, limit);
    
    console.log('Returning', randomArticles.length, 'random articles');
    console.log('=== RANDOM ARTICLES API END (SUCCESS) ===\n');
    
    return NextResponse.json({ data: randomArticles });
    
  } catch (error) {
    console.error('❌ Exception in random-articles API:', error);
    console.log('=== RANDOM ARTICLES API END (EXCEPTION) ===\n');
    return NextResponse.json({ data: [], error: String(error) }, { status: 200 });
  }
}