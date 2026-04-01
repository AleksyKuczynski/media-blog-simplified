// src/primitives/FloatingButton.tsx
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
          fixed p-2 md:p-3 transition-all duration-200
          text-sf bg-sec-cont hover:bg-sec-fix
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