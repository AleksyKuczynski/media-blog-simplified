// src/shared/ui/Dropdown/DropdownTrigger.tsx
import React from 'react';
import { useDropdownContext } from './useDropdown';
import { ChevronDownIcon, CloseIcon } from '@/shared/primitives/Icons';

interface DropdownTriggerProps {
  children: React.ReactNode;
  className?: string;
  classNames?: {
    text?: string;
    icon?: string;
    label?: string;
  };
  ariaLabel?: string;
  label?: string;
}

export default function DropdownTrigger({ 
  children, 
  className = '',
  classNames = {},
  ariaLabel,
  label
}: DropdownTriggerProps) {
  const { 
    triggerRef, 
    isOpen, 
    handleClick,
    handleKeyDown,
    handleReset,
    isDefaultSelected
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
      className={`${className} ${isOpen ? 'is-dropdown-open' : ''}`}
      type="button"
    >
      {label && <span className={classNames.label}>{label}</span>}
      <div className="flex items-center justify-between w-full">
        <span className={classNames.text}>
          {children}
        </span>
        {!isDefaultSelected && (
          <CloseIcon 
            className={classNames.icon} 
            onClick={handleReset}
          />
        )}
      </div>
    </button>
  );
}