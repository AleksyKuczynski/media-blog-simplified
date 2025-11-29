// src/features/navigation/MobileNav/OffcanvasPanel.tsx
'use client'

import React from 'react';
import { MobilePanelOverlay } from './MobilePanelOverlay';
import { OFFCANVAS_PANEL_STYLES } from './styles';
import { cn } from '@/lib/utils';
import { CloseIcon } from '@/shared/primitives/Icons';

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
  
  const getTransformClasses = () => {
    if (side === 'left') {
      return isOpen ? 'translate-x-0' : '-translate-x-full';
    } else {
      return isOpen ? 'translate-x-0' : 'translate-x-full';
    }
  }

  const panelClasses = cn(
    OFFCANVAS_PANEL_STYLES.panel.base,
    side === 'left' ? OFFCANVAS_PANEL_STYLES.panel.left : OFFCANVAS_PANEL_STYLES.panel.right,
    getTransformClasses()
  );

  return (
    <>
      {isOpen && <MobilePanelOverlay onClose={onClose} />}
      
      <div
        ref={panelRef}
        id={id}
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-hidden={!isOpen}
      >
        <div className={OFFCANVAS_PANEL_STYLES.header.container}>
          <h2 className={OFFCANVAS_PANEL_STYLES.header.title}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className={OFFCANVAS_PANEL_STYLES.header.closeButton}
            aria-label="Close"
            type="button"
          >
            <CloseIcon className={OFFCANVAS_PANEL_STYLES.header.closeIcon} />
          </button>
        </div>
        
        {children}
      </div>
    </>
  );
}