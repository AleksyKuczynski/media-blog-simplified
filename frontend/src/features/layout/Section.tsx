// src/features/layout/Section.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { SECTION_STYLES } from './styles';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  isOdd?: boolean;
  title?: string;
  ariaLabel?: string;
  id?: string;
  as?: 'section' | 'article' | 'aside' | 'nav' | 'div';
  role?: string;
  itemScope?: boolean;
  itemType?: string;
}

export default function Section({ 
  children, 
  className = '', 
  isOdd = false,
  title,
  ariaLabel,
  id,
  as: Component = 'section',
  role,
  itemScope,
  itemType,
  ...props 
}: SectionProps) {
  const sectionClasses = cn(
    SECTION_STYLES.wrapper.base,
    isOdd ? SECTION_STYLES.wrapper.odd : SECTION_STYLES.wrapper.even,
    className
  );

  const sectionProps = {
    className: sectionClasses,
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(id && { id }),
    ...(role && { role }),
    ...(itemScope && { itemScope: true }),
    ...(itemType && { itemType }),
    ...props
  };

  return (
    <Component {...sectionProps}>
      <div className={SECTION_STYLES.container}>
        {title && (
          <header className={SECTION_STYLES.header.wrapper}>
            <h2 className={SECTION_STYLES.header.title}>
              {title}
            </h2>
          </header>
        )}
        {children}
      </div>
    </Component>
  );
}