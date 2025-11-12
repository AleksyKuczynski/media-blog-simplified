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
  
  return (
    <Tag className={ELEMENTS_STYLES.list.base}>
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