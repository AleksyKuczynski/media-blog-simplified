// src/shared/ui/Dropdown/DropdownTrigger.tsx
import React from 'react';
import { useDropdownContext } from './DropdownContext';
import { ChevronDownIcon } from '@/shared/primitives/Icons';

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  ariaLabel?: string;
}

export default function DropdownTrigger({ 
  children, 
  className = '',
  textClassName = '',
  iconClassName = '',
  ariaLabel 
}: DropdownTriggerProps) {
  const { 
    triggerRef, 
    isOpen, 
    handleClick,
    handleKeyDown 
  } = useDropdownContext();

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    handleKeyDown(e as unknown as KeyboardEvent);
  };

  return (
    <button
      ref={triggerRef}
      onClick={handleClick}
      onKeyDown={handleTriggerKeyDown}
      aria-expanded={isOpen}
      aria-haspopup={true}
      aria-controls={isOpen ? 'dropdown-menu' : undefined}
      aria-label={ariaLabel}
      className={className}
      type="button"
    >
      <span className={textClassName}>
        {children}
      </span>
      <ChevronDownIcon className={iconClassName} />
    </button>
  );
}