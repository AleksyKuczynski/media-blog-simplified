// src/shared/ui/Collapsible.tsx
'use client'

import { useState } from 'react';
import { ChevronDownIcon } from '../primitives/Icons';

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
  const [showContent, setShowContent] = useState(false);

  const toggleOpen = () => {
    if (!isOpen) {
      // Opening: expand height first, then fade in content
      setIsOpen(true);
      setTimeout(() => {
        setShowContent(true);
      }, 300); // After height animation
    } else {
      // Closing: fade out content first, then collapse height
      setShowContent(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 200); // After opacity animation
    }
  };

  const buttonId = `collapsible-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `${buttonId}-content`;

  return (
    <div className="collapsible mb-16">
      {/* Mobile: Collapsible with pill button and connecting line */}
      <div className="xl:hidden">
        <div className="flex items-center gap-0 relative z-10">
          {/* Pill-shaped button */}
          <button
            id={buttonId}
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-controls={contentId}
            aria-label={ariaLabel || title}
            className="
              flex items-center gap-3
              px-6 py-2 mx-auto
              bg-sf-cont rounded-full
              shadow-md focus:shadow-sm
              transition-colors duration-200
              border border-ol-var
            "
            type="button"
          >
            <div className="flex items-center gap-3 text-pr-cont">
              {icon && <span className="text-pr-cont">{icon}</span>}
              <span className="font-medium whitespace-nowrap">
                {title}
              </span>
            </div>

            <span 
              className="text-on-sf-var transition-transform duration-200"
              style={{ 
                transform: isOpen ? 'scaleY(-1)' : 'scaleY(1)',
                transformOrigin: 'center center'
              }}
              aria-hidden="true"
            >
              <ChevronDownIcon className="w-8 h-8 text-pr-cont" />
            </span>
          </button>
        </div>

        {/* Content box - always rendered, animated */}
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className="-mt-6 pl-0 relative border border-ol-var shadow-md"
          style={{
            height: isOpen ? 'auto' : '1px',
            maxHeight: isOpen ? '2000px' : '1px',
            transition: 'max-height 300ms ease-in-out',
            overflow: 'hidden',
          }}
        >
          <div 
            className="p-4 pt-8"
            style={{
              opacity: showContent ? 1 : 0,
              transition: 'opacity 200ms ease-in-out',
              minHeight: '1px',
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Desktop: Static heading with always-visible content */}
      <div className="hidden xl:block bg-sf-cont/50 border border-ol-var/20">
        <h2 className="flex items-center gap-3 px-4 py-3 font-medium text-on-sf">
          {icon && <span className="text-on-sf-var">{icon}</span>}
          <span>{title}</span>
        </h2>

        <div className="px-4 py-3 text-on-sf-var">
          {children}
        </div>
      </div>
    </div>
  );
}