// src/main/components/Article/elements/Paragraph.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '@/main/components/Article/styles';

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