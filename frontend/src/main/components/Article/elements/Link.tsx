// src/main/components/Article/elements/Link.tsx
import React from 'react';
import Link from 'next/link';

interface ArticleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export const ArticleLink = ({ href, children, external }: ArticleLinkProps) => {
  const linkStyles = "text-pr-cont hover:text-pr-fix underline underline-offset-4 transition-colors duration-200";

  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={linkStyles}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkStyles}>
      {children}
    </Link>
  );
};