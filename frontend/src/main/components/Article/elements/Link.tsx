// src/main/components/Article/elements/Link.tsx
import React from 'react';
import Link from 'next/link';
import { ELEMENTS_STYLES } from '../styles';

interface ArticleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export const ArticleLink = ({ href, children, external }: ArticleLinkProps) => {

  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={ELEMENTS_STYLES.link.base}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={ELEMENTS_STYLES.link.base}>
      {children}
    </Link>
  );
};