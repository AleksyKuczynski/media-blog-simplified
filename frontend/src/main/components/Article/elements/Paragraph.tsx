// src/main/components/Article/elements/Paragraph.tsx
import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
}

export const ArticleParagraph = ({ children }: ParagraphProps) => {
  return (
    <p className="
      mb-6 text-base md:text-lg
      text-on-sf-var leading-relaxed
      first:mt-0 last:mb-0
      prose-sm
    ">
      {children}
    </p>
  );
};