// app/[lang]/[rubric]/[slug]/_components/content/Heading.tsx
/**
 * Article Content - Heading Elements
 * 
 * Handles h1-h6 heading elements with consistent styling.
 * Automatically includes anchor IDs for TOC linking.
 * Server component.
 * 
 * Features:
 * - Responsive font sizing
 * - Proper semantic hierarchy
 * - Anchor link support
 * 
 * Dependencies:
 * - article.styles.ts (ELEMENTS_STYLES.heading)
 * 
 * @param level - Heading level (1-6)
 * @param children - Heading text content
 * @param id - Optional anchor ID
 */

import React from 'react';
import { ELEMENTS_STYLES } from '../article.styles';

interface HeadingProps {
  level:  2 | 3 | 4;
  children: React.ReactNode;
  id?: string;
}

const styles = ELEMENTS_STYLES.heading;

export const ArticleHeading = ({ level, children, id }: HeadingProps) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  // Direct rounded theme styling for all heading levels
  const getHeadingStyles = (level: number) => {
    const baseStyles = styles.base;
    
    switch (level) {
      case 2:
        return `${baseStyles} ${styles.h2}`;
      case 3:
        return `${baseStyles} ${styles.h3}`;
      case 4:
        return `${baseStyles} ${styles.h4}`;
      default:
        return baseStyles;
    }
  };

  return (
    <Tag id={id} className={getHeadingStyles(level)}>
      {children}
    </Tag>
  );
};