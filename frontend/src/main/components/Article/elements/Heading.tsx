// src/main/components/Article/elements/Heading.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '../styles';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  id?: string;
}

export const ArticleHeading = ({ level, children, id }: HeadingProps) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  // Direct rounded theme styling for all heading levels
  const getHeadingStyles = (level: number) => {
    const baseStyles = ELEMENTS_STYLES.heading.base;
    
    switch (level) {
      case 1:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h1}`;
      case 2:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h2}`;
      case 3:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h3}`;
      case 4:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h4}`;
      case 5:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h5}`;
      case 6:
        return `${baseStyles} ${ELEMENTS_STYLES.heading.h6}`;
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