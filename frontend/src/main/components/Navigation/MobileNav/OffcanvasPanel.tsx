// src/main/components/Navigation/OffcanvasPanel.tsx
// Unified offcanvas panel component for mobile menu and search
// Can slide from left or right based on props

'use client'

import React from 'react';
import { MobilePanelOverlay } from './MobilePanelOverlay';

interface OffcanvasPanelProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  side: 'left' | 'right';
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
  panelRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * OffcanvasPanel - Unified slide panel component
 * Used for both mobile menu (left) and mobile search (right)
 * Handles overlay, animations, and accessibility
 */
export default function OffcanvasPanel({
  id,
  isOpen,
  onClose,
  side,
  title,
  ariaLabel,
  children,
  panelRef
}: OffcanvasPanelProps) {
  
  // Calculate transform classes based on side and open state
  const getTransformClasses = () => {
    if (side === 'left') {
      return isOpen ? 'translate-x-0' : '-translate-x-full';
    } else {
      return isOpen ? 'translate-x-0' : 'translate-x-full';
    }
  };

  // Handle clicks inside panel - allow interactions with content
  const handlePanelClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if the clicked element is interactive
    const isInteractiveElement = 
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('a') ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('[role="button"]') ||
      target.closest('[role="menuitem"]') ||
      target.closest('[role="combobox"]') ||
      target.closest('[role="option"]') ||
      target.closest('.search-container') ||
      target.closest('[data-interactive]');
    
    // Don't close if clicking interactive elements
    if (isInteractiveElement) {
      return;
    }
  };

  return (
    <>
      {/* Overlay - appears when panel is open */}
      {isOpen && <MobilePanelOverlay onClose={onClose} />}

      {/* Slide Panel */}
      <div
        ref={panelRef}
        id={id}
        onClick={handlePanelClick}
        className={`
          fixed top-16 left-0 right-0 bottom-0 z-[60] pointer-events-auto
          bg-sf-cont/95 backdrop-blur-lg border-b border-ol-var/20
          transform transition-transform duration-300 ease-in-out
          ${getTransformClasses()}
        `}
        aria-hidden={!isOpen}
        aria-label={ariaLabel}
      >
        <div className="flex flex-col h-full">
          {/* Panel Header */}
          <div className="px-6 py-4 border-b border-ol-var/20">
            <h2 className="text-lg font-semibold text-on-sf">
              {title}
            </h2>
          </div>

          {/* Panel Content - scrollable */}
          <div className="flex-1 overflow-y-auto" data-interactive="true">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}