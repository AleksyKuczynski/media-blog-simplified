// src/main/components/Interface/Collapsible.tsx
'use client'

import { useState } from 'react';
import { ChevronDownIcon } from './Icons';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export default function Collapsible({
  title,
  children,
  icon,
  ariaLabel,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const buttonId = `collapsible-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `${buttonId}-content`;

  return (
    <div className="collapsible mb-6 bg-sf-cont/50 border border-ol-var/20">
      {/* Mobile: Collapsible Button */}
      <button
        id={buttonId}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={ariaLabel || title}
        className="
          md:hidden
          flex items-center justify-between w-full
          px-4 py-3
          bg-sf-hi hover:bg-sf-hst rounded-lg
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2
        "
        type="button"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-on-sf-var">{icon}</span>}
          <span className="font-medium text-on-sf">
            {title}
          </span>
        </div>

        <span 
          className="text-on-sf-var transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <ChevronDownIcon className="w-5 h-5" />
        </span>
      </button>

      {/* Desktop: Static Heading */}
      <h2 className="hidden md:flex items-center gap-3 px-4 py-3 font-medium text-on-sf">
        {icon && <span className="text-on-sf-var">{icon}</span>}
        <span>{title}</span>
      </h2>

      {/* Content: Collapsible on mobile, always visible on desktop */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={`
          overflow-hidden transition-all duration-300 text-on-sf-var
          ${isOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
          md:max-h-none md:opacity-100 md:mt-2
        `}
      >
        <div className="px-4 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}