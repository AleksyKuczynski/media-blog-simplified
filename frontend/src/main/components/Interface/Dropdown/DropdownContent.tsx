// src/main/components/Interface/Dropdown/DropdownContent.tsx - CLEANED UP
'use client';

import React from 'react';
import { useDropdownContext } from './DropdownContext';
import type { DropdownContentProps } from './types';

export default function DropdownContent({
  children,
  width = 'auto',
  position = 'left'
}: DropdownContentProps) {
  const { isOpen } = useDropdownContext();

  // Width classes for different dropdown sizes
  const widthClasses = {
    icon: 'w-40',
    narrow: 'w-48',
    wide: 'w-64',
    auto: 'w-auto'
  };

  // Position classes
  const positionClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0'
  };

  return (
    <div 
      className={`
        absolute z-[70] shadow-lg bg-sf-hi 
        transition-all duration-200 ease-in-out origin-top
        rounded-lg
        ${widthClasses[width]}
        ${positionClasses[position]}
        ${isOpen 
          ? 'opacity-100 scale-y-100 transform' 
          : 'opacity-0 scale-y-0 pointer-events-none'
        }
      `.trim()}
      role="menu"
      aria-orientation="vertical"
      style={{ 
        maxHeight: 'calc(var(--vh, 1vh) * 80)',
        top: 'calc(100% + 0.5rem)'
      }}
    >
      {children}
    </div>
  );
}