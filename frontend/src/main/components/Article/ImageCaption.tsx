// src/main/components/Article/ImageCaption.tsx
'use client'

import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

interface ImageCaptionProps {
  caption?: string;
  processedCaption?: string;
  className?: string;
  variant?: 'default' | 'inline' | 'overlay' | 'below';
}

export const ImageCaption = memo(function ImageCaption({ 
  caption,
  processedCaption,
  className,
  variant = 'below'
}: ImageCaptionProps) {
  // Don't render if no caption content
  if (!processedCaption && !caption) {
    return null;
  }

  const captionContent = processedCaption || caption;
  if (!captionContent || captionContent.trim() === '') {
    return null;
  }

  const baseStyles = "text-sm text-on-sf-var leading-relaxed";
  
  const variantStyles = {
    default: twMerge(
      baseStyles,
      "mt-4 px-2 text-center",
      "theme-default:text-center",
      "theme-rounded:bg-sf-cont theme-rounded:p-4 theme-rounded:rounded-lg theme-rounded:mt-2",
      "theme-sharp:border-l-2 theme-sharp:border-pr-cont theme-sharp:pl-4"
    ),
    inline: twMerge(
      baseStyles,
      "inline-block px-2 py-1 bg-sf-cont/80 backdrop-blur-sm rounded text-xs",
      "theme-default:rounded-md",
      "theme-rounded:rounded-lg",
      "theme-sharp:rounded-none theme-sharp:border theme-sharp:border-ol"
    ),
    overlay: twMerge(
      baseStyles,
      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white",
      "theme-default:from-black/80",
      "theme-rounded:rounded-b-2xl",
      "theme-sharp:rounded-none"
    ),
    below: twMerge(
      baseStyles,
      "mt-4 px-2",
      "theme-default:text-center",
      "theme-rounded:bg-sf-cont theme-rounded:p-4 theme-rounded:rounded-lg theme-rounded:mt-2 theme-rounded:shadow-sm",
      "theme-sharp:border-l-2 theme-sharp:border-pr-cont theme-sharp:pl-4 theme-sharp:text-left"
    )
  };

  const finalStyles = twMerge(variantStyles[variant], className);

  return (
    <figcaption className={finalStyles}>
      {processedCaption ? (
        <div dangerouslySetInnerHTML={{ __html: processedCaption }} />
      ) : (
        <span>{caption}</span>
      )}
    </figcaption>
  );
});

export default ImageCaption;