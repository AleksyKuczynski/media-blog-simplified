import { NextRequest, NextResponse } from 'next/server';
import { SITE_URL } from '@/config/constants/constants';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const INDEXNOW_WEBHOOK_SECRET = process.env.INDEXNOW_WEBHOOK_SECRET;

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function POST(request: NextRequest) {
  if (!INDEXNOW_KEY || !INDEXNOW_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'IndexNow not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${INDEXNOW_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { slug?: string; rubricSlug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { slug, rubricSlug } = body;
  if (!slug || !rubricSlug) {
    return NextResponse.json({ error: 'slug and rubricSlug are required' }, { status: 400 });
  }

  const urls = [
    `${SITE_URL}/en/${rubricSlug}/${slug}`,
    `${SITE_URL}/ru/${rubricSlug}/${slug}`,
  ];

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  if (!res.ok) {
    console.error(`[indexnow] Submission failed: ${res.status}`);
    return NextResponse.json({ error: 'IndexNow submission failed' }, { status: 502 });
  }

  return NextResponse.json({ submitted: urls });
}
