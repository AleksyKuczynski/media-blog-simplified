// src/main/components/Main/Section.tsx - Enhanced for SEO and Accessibility
import React from 'react';
import { cn } from '@/lib/utils';

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
    // Base section styling
    "w-full pb-6 lg:pb-8 xl:pb-12",
    // Background alternation for visual hierarchy
    isOdd ? "bg-sf" : "bg-sf-hst",
    // Additional custom classes
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
      <div className="container mx-auto">
        {/* Section title handled internally - no duplication */}
        {title && (
          <header className="mb-8">
            <h2 className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 pl-1
              text-sf-hst
            ">
              {title}
            </h2>
          </header>
        )}
        
        {/* Main content area */}
        {children}
      </div>
    </Component>
  );
}