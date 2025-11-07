// frontend/src/main/components/Interface/Modal/Modal.tsx
'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useOutsideClick } from '@/main/lib/hooks/useOutsideClick';

export type ModalPosition = 'center' | 'bottom-left' | 'bottom-right';
export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: ModalPosition;
  size?: ModalSize;
  title?: string;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
};

const positionClasses: Record<ModalPosition, string> = {
  center: 'items-center justify-center',
  'bottom-left': 'items-end justify-start',
  'bottom-right': 'items-end justify-end',
};

export function Modal({
  isOpen,
  onClose,
  children,
  position = 'center',
  size = 'md',
  title,
  className = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEscape, onClose]);

  // Register escape key listener
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeOnEscape, handleKeyDown]);

  // Use outside click hook
  useOutsideClick(
    modalRef,
    null,
    isOpen,
    closeOnBackdropClick ? onClose : () => {}
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div 
        className={`fixed inset-0 z-[61] flex p-4 ${positionClasses[position]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Modal content */}
        <div
          ref={modalRef}
          className={`
            ${sizeClasses[size]}
            bg-sf-cont 
            border border-ol-var 
            rounded-xl 
            shadow-2xl 
            overflow-hidden
            animate-fade-in
            ${position !== 'center' ? 'm-4' : ''}
            ${className}
          `.trim()}
        >
          {/* Header with title and close button */}
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-ol-var">
              <h2 
                id="modal-title" 
                className="text-lg font-semibold text-on-sf"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-on-sf-var hover:text-on-sf hover:bg-sf-hi rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pr-fix"
                aria-label="Закрыть"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Content */}
          <div className={title ? '' : 'p-6'}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}