// src/features/article-display/ArticleLink.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

interface ArticleLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  href: string;
  fromContext?: string;
}

export function ArticleLink({ href, fromContext, onClick, ...props }: ArticleLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (fromContext && !e.defaultPrevented) {
          e.preventDefault();
          router.push(`${href}?from=${encodeURIComponent(fromContext)}`);
        }
      }}
      {...props}
    />
  );
}