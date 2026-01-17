// app/[lang]/[rubric]/[slug]/_components/content/List.tsx
/**
 * Article Content - List Elements
 * 
 * Handles both ordered (ol) and unordered (ul) lists.
 * Server component with proper semantic HTML.
 * 
 * Dependencies:
 * - article.styles.ts (ELEMENTS_STYLES.list)
 * 
 * @param ordered - True for <ol>, false for <ul>
 * @param children - ListItem components
 */

import React from 'react';
import { ELEMENTS_STYLES } from '../article.styles';


interface ListProps {
  ordered?: boolean;
  children: React.ReactNode;
}

interface ListItemProps {
  children: React.ReactNode;
}

export const ArticleList = ({ ordered = false, children }: ListProps) => {
  const Tag = ordered ? 'ol' : 'ul';
  const listTypeClass = ordered ? ELEMENTS_STYLES.list.ordered : ELEMENTS_STYLES.list.unordered;
  
  return (
    <Tag className={`${ELEMENTS_STYLES.list.base} ${listTypeClass}`}>
      {children}
    </Tag>
  );
};

export const ArticleListItem = ({ children }: ListItemProps) => {
  return (
    <>
      {children}
    </>
  );
};