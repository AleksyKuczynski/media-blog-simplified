// src/features/layout/CardGrid.tsx
import React from 'react';
import { CARD_GRID_STYLES } from './layout.styles';

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function CardGrid({ 
  children, 
  className = ''
}: CardGridProps) {
  return (
    <div className={`
      ${CARD_GRID_STYLES}
      ${className}
    `}>
      {children}
    </div>
  );
}