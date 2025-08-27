// src/main/components/Interface/FloatingButton.tsx - CLEANED UP
import { forwardRef } from 'react';

interface FloatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  position?: 'top-right' | 'bottom-right';
  zIndex?: 'default' | 'menu';
}

export const FloatingButton = forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ 
    position = 'bottom-right', 
    zIndex = 'default',
    className,
    children,
    ...props 
  }, ref) => {
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'bottom-right': 'bottom-4 right-4'
    };

    const zIndexClasses = {
      'default': 'z-50',
      'menu': 'z-[70]'
    };

    return (
      <button
        ref={ref}
        type="button"
        className={`
          fixed p-2 transition-all duration-200
          text-on-pr bg-pr-cont hover:bg-pr-fix
          rounded-full shadow-lg hover:shadow-xl
          ${positionClasses[position]}
          ${zIndexClasses[zIndex]}
          ${className || ''}
        `.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FloatingButton.displayName = 'FloatingButton';