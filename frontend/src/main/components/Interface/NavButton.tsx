// src/main/components/Interface/NavButton.tsx
import React, { forwardRef } from 'react';

interface NavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  context: 'desktop' | 'mobile';
  icon?: React.ReactNode;
  noHover?: boolean;
  isHamburger?: boolean;
}

const buttonStyles = {
  base: 'transition-all duration-200 text-on-sf-var',
  desktop: {
    default: 'p-2',
    rounded: 'p-2',
    sharp: 'p-2',
  },
  mobile: {
    default: 'px-3 py-1',
    rounded: 'px-3 py-1',
    sharp: 'px-3 py-1',
  }
};

const hoverStyles = {
  desktop: {
    default: 'text-on-sf',
    rounded: 'text-on-sf',
    sharp: 'text-on-sf',
  },
};

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ context, icon, className = '', noHover = false, isHamburger = false, children, onClick, ...props }, ref) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('NavButton clicked');
      onClick?.(e);
    };

    const getButtonStyles = () => {
      const baseStyle = buttonStyles.base;
      const contextStyle = buttonStyles[context][currentTheme];
      const hoverStyle = !noHover && context === 'desktop' ? hoverStyles.desktop[currentTheme] : '';
      return `${baseStyle} ${contextStyle} ${hoverStyle} ${className}`;
    };

    const classes = getButtonStyles();

    return (
      <button
        ref={ref}
        className={classes}
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