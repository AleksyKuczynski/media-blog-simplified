// src/main/components/Article/elements/Heading.tsx
import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
}

export const ArticleHeading = ({ level, children, id }: HeadingProps) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  // Direct rounded theme styling for all heading levels
  const getHeadingStyles = (level: number) => {
    const baseStyles = "font-bold text-on-sf mb-4 mt-8 first:mt-0";
    
    switch (level) {
      case 1:
        return `${baseStyles} text-3xl md:text-4xl font-display`;
      case 2:
        return `${baseStyles} text-2xl md:text-3xl font-sans`;
      case 3:
        return `${baseStyles} text-xl md:text-2xl font-sans`;
      case 4:
        return `${baseStyles} text-lg md:text-xl font-sans`;
      case 5:
        return `${baseStyles} text-base md:text-xl font-display`;
      case 6:
        return `${baseStyles} text-sm md:text-lg font-display`;
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