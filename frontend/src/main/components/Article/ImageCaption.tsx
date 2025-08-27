// src/main/components/Article/ImageCaption.tsx
import React from 'react';

interface ImageCaptionProps {
  children: React.ReactNode;
  alignment?: 'left' | 'center' | 'right';
}

export const ImageCaption = ({ children, alignment = 'center' }: ImageCaptionProps) => {
  const alignmentStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <figcaption className={`
      text-sm text-on-sf-var mt-3 mb-6
      font-serif leading-relaxed
      ${alignmentStyles[alignment]}
    `}>
      {children}
    </figcaption>
  );
};