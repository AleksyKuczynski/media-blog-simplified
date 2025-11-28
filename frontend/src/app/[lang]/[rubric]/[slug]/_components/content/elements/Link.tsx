// src/app/[lang]/[rubric]/[slug]/_components/content/elements/Link.tsx
import React from 'react';
import Link from 'next/link';
import { ELEMENTS_STYLES } from '../../article.styles';

interface ArticleLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

const styles = ELEMENTS_STYLES.link;

export const ArticleLink = ({ href, children, external }: ArticleLinkProps) => {

  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.base}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={styles.base}>
      {children}
    </Link>
  );
};