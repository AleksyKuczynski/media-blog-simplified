// app/[lang]/[rubric]/[slug]/_components/content/Paragraph.tsx
/**
 * Article Content - Paragraph Element
 * 
 * Standard paragraph component for markdown content.
 * Server component with typography styling.
 * 
 * Dependencies:
 * - article.styles.ts (ELEMENTS_STYLES.paragraph)
 */

import React from 'react';
import { ELEMENTS_STYLES } from '../article.styles';

interface ParagraphProps {
  children: React.ReactNode;
}

export const ArticleParagraph = ({ children }: ParagraphProps) => {
  return (
    <p className={ELEMENTS_STYLES.paragraph.base}>
      {children}
    </p>
  );
};