// frontend/src/app/api/preview/enter/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const redirect = searchParams.get('redirect') || '/';

  if (!secret || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Validate redirect path to prevent open redirect
  const safePath = redirect.startsWith('/') ? redirect : '/';

  // Instead of a 302 redirect (which causes browsers to drop Set-Cookie in iframes),
  // serve an HTML page that sets the cookie and navigates via JS/meta-refresh.
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

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      // Also attempt Set-Cookie header as fallback
      'Set-Cookie': `preview-mode=true; Path=/; Max-Age=3600; SameSite=None; Secure; HttpOnly`,
    },
  });
}