// app/[lang]/[rubric]/[slug]/_components/content/ListItem.tsx
/**
 * Article Content - List Item Element
 * 
 * Individual list item component.
 * Server component with typography styling.
 * 
 * Dependencies:
 * - article.styles.ts (ELEMENTS_STYLES.list.item)
 */

import React from 'react';
import { ELEMENTS_STYLES } from '../article.styles';

export const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  return <li className={ELEMENTS_STYLES.list.item}>{children}</li>;
};