// src/main/components/Main/CardGrid.tsx
import React from 'react';

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    large?: number;
  };
}

export default function CardGrid({ 
  children, 
  className,
  cols = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 3
  }
}: CardGridProps) {
  return (
    <div className={`
      w-full grid gap-6 lg:gap-8
      grid-cols-${cols.mobile}
      md:grid-cols-${cols.tablet}
      lg:grid-cols-${cols.desktop}
      xl:grid-cols-${cols.large}
      ${className || ''}
    `}>
      {children}
    </div>
  );
}