// src/app/[lang]/[rubric]/[slug]/_components/content/elements/Paragraph.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '../../article.styles';

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