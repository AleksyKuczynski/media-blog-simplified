// src/main/components/Interface/NavButton.tsx - CLEANED UP
import React, { forwardRef } from 'react';

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  context: 'desktop' | 'mobile';
  icon?: React.ReactNode;
  noHover?: boolean;
  isHamburger?: boolean;
}

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ context, icon, className = '', noHover = false, children, onClick, ...props }, ref) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.(e);
    };

    // Direct inline classes for rounded theme - no more complex theme system
    const baseClasses = "transition-all duration-200 text-on-sf-var";
    const contextClasses = context === 'desktop' ? "p-2" : "px-3 py-1";
    const hoverClasses = !noHover && context === 'desktop' ? "hover:text-on-sf hover:bg-sf-hi rounded-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${contextClasses} ${hoverClasses} ${className}`.trim()}
        onClick={handleClick}
        type='button'
        {...props}
      >
        {icon || children}
      </button>
    );
  }
);

NavButton.displayName = 'NavButton';