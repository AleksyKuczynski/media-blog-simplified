// src/main/components/ScrollRestorationClient.tsx
'use client';

import { useEffect, useState } from 'react';
import ScrollRestoration from '@/main/lib/hooks/useScrollRestoration';

/**
 * Client-side wrapper to ensure ScrollRestoration only runs in browser
 * Fixes hydration issues with server-rendered layouts
 */
export default function ScrollRestorationClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return <ScrollRestoration />;
}