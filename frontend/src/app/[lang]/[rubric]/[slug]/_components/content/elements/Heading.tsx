// src/app/[lang]/[rubric]/[slug]/_components/content/elements/Heading.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '../../article.styles';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
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
      case 1:
        return `${baseStyles} ${styles.h1}`;
      case 2:
        return `${baseStyles} ${styles.h2}`;
      case 3:
        return `${baseStyles} ${styles.h3}`;
      case 4:
        return `${baseStyles} ${styles.h4}`;
      case 5:
        return `${baseStyles} ${styles.h5}`;
      case 6:
        return `${baseStyles} ${styles.h6}`;
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