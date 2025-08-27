// src/main/components/Article/elements/List.tsx
import React from 'react';

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
    <Tag className="
      mb-6 pl-6 space-y-2
      text-on-sf-var leading-relaxed
    ">
      {children}
    </Tag>
  );
};

export const ArticleListItem = ({ children }: ListItemProps) => {
  return (
    <li className="
      text-on-sf-var
      marker:text-pr-cont
    ">
      {children}
    </li>
  );
};