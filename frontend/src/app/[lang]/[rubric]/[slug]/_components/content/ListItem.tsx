// src/app/[lang]/[rubric]/[slug]/_components/content/ListItem.tsx
import React from 'react';
import { ELEMENTS_STYLES } from '../article.styles';

export const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  return <li className={ELEMENTS_STYLES.list.item}>{children}</li>;
};