// app/[lang]/[rubric]/[slug]/_components/content/Link.tsx
/**
 * Article Content - Link Element
 * 
 * Markdown link component with external link detection.
 * Opens external links in new tab with security attributes.
 * Server component.
 * 
 * Features:
 * - External link detection (http/https)
 * - rel="noopener noreferrer" for external links
 * - Internal link routing via Next.js Link
 * 
 * Dependencies:
 * - article.styles.ts (ELEMENTS_STYLES.link)
 * 
 * @param href - Link destination
 * @param children - Link text
 */

import React from 'react';
import Link from 'next/link';
import { ELEMENTS_STYLES } from '../article.styles';

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