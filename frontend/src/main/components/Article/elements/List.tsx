// src/main/components/Article/elements/List.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '../styles';


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