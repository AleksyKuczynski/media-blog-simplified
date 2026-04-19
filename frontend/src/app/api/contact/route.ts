// frontend/src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;
const FLOW_ID = process.env.DIRECTUS_FLOW_CONTACT;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!DIRECTUS_URL || !DIRECTUS_API_TOKEN || !FLOW_ID) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  let body: { email?: string; subject?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { email, subject, message } = body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (!subject?.trim() || subject.length > 200) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }
  if (!message?.trim() || message.length > 5000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  }

  const res = await fetch(`${DIRECTUS_URL}/flows/trigger/${FLOW_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DIRECTUS_API_TOKEN}`,
    },
    body: JSON.stringify({ email, subject, message }),
  });

  if (!res.ok) {
    console.error(`[contact] Flow trigger failed: ${res.status}`);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}