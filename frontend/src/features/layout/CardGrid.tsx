// src/features/layout/CardGrid.tsx
import React from 'react';

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
      w-full 
      flex flex-wrap
      gap-6 lg:gap-8
      p-2  lg:p-8
      ${className}
    `}>
      {children}
    </div>
  );
}