// src/primitives/CustomButton.tsx

import React from 'react';

type ButtonColor = 'accent' | 'primary';

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: ButtonColor;
  filled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function CustomButton({ 
  color = 'primary', 
  filled = true, 
  children, 
  onClick, 
  type = 'button',
}: CustomButtonProps) {
  // ✅ DIRECT TAILWIND: Much simpler and more readable
  const getButtonClasses = () => {
    const base = "px-5 py-3 rounded-xl font-medium transition-all duration-200 border-2";
    
    if (filled) {
      switch (color) {
        case 'accent':
          return `${base} bg-emerald-500 hover:bg-emerald-600 text-white border-transparent dark:bg-emerald-600 dark:hover:bg-emerald-700`;
        case 'primary':
          return `${base} bg-blue-500 hover:bg-blue-600 text-white border-transparent dark:bg-blue-600 dark:hover:bg-blue-700`;
        default:
          return `${base} bg-gray-500 hover:bg-gray-600 text-white border-transparent dark:bg-gray-600 dark:hover:bg-gray-700`;
      }
    } else {
      switch (color) {
        case 'accent':
          return `${base} bg-transparent hover:bg-emerald-50 border-emerald-500 text-emerald-600 dark:hover:bg-emerald-900/20 dark:text-emerald-400`;
        case 'primary':
          return `${base} bg-transparent hover:bg-blue-50 border-blue-500 text-blue-600 dark:hover:bg-blue-900/20 dark:text-blue-400`;
        default:
          return `${base} bg-transparent hover:bg-gray-50 border-gray-500 text-gray-600 dark:hover:bg-gray-900/20 dark:text-gray-400`;
      }
    }
  };

  return (
    <button
      type={type}
      className={getButtonClasses()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}