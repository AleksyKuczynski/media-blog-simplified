// src/main/components/Interface/Modal/ModalController.tsx - CLEANED UP
'use client';

import { useRef, useReducer, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { modalReducer, initialState } from './modalReducer';
import { useOutsideClick } from '@/main/lib/hooks';
import { ANIMATION_DURATION } from '../constants';
import Modal from './Modal';

interface ModalControllerProps {
  children: React.ReactNode;
  modalType: string;
  title?: string;
  description?: string;
  onClose?: () => void;
}

export default function ModalController({
  children,
  modalType,
  title,
  description,
  onClose
}: ModalControllerProps) {
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (state.visibility === 'visible') {
      dispatch({ type: 'START_CLOSING' });
      setTimeout(() => {
        dispatch({ type: 'FINISH_CLOSING' });
        onClose?.();
      }, ANIMATION_DURATION);
    }
  }, [state.visibility, onClose]);

  // Handle Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
  }, [handleClose]);

  useOutsideClick(containerRef, null, state.visibility !== 'hidden', handleClose);

  // Open modal logic
  if (state.visibility === 'hidden' && modalType) {
    dispatch({ 
      type: 'OPEN_MODAL', 
      payload: { type: modalType, title, description } 
    });
    setTimeout(() => {
      dispatch({ type: 'FINISH_OPENING' });
    }, ANIMATION_DURATION);
  }

  if (state.visibility === 'hidden') return null;

  return createPortal(
    <Modal
      visibility={state.visibility}
      theme="rounded" // Hardcoded rounded theme
      title={title}
      description={description}
      onClose={handleClose}
      containerRef={containerRef}
    >
      {children}
    </Modal>,
    document.body
  );
}