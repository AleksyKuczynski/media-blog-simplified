// src/main/components/Article/ImageFrame.tsx

'use client'

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/main/lib/utils/utils';
import { ImageAttributes, ImageFrameDimensions } from '@/main/lib/image-utils/imageFrameTypes';
import { calculateImageFrameDimensionsClient } from '@/main/lib/image-utils/calculateImageFrameDimensions';
import { ImageFrameSkeleton } from './ImageFrameSkeleton';

interface ImageFrameProps {
  imageAttributes: ImageAttributes;
  caption?: string;
  processedCaption?: string;
  maxWidth?: number;
  className?: string;
}

// ✅ EXTRACT STYLING CONSTANTS FROM IMAGEFRAME
export const IMAGE_FRAME_STYLES = {
  wrapper: 'w-full mb-8', // Outer wrapper for image + caption
  figure: 'w-full',
  container: 'relative mx-auto overflow-hidden bg-sf-cont rounded-2xl shadow-lg',
  image: 'w-full h-full object-cover',
  // ✅ NEW: Simple caption styling - outside image container for readability
  caption: 'prose-sm text-on-sf-var mt-4 text-center px-4',
} as const;

// ✅ ENHANCED SKELETON STYLES WITH SHIMMER EFFECT
export const IMAGE_FRAME_SKELETON_STYLES = {
  figure: IMAGE_FRAME_STYLES.figure,
  container: cn(IMAGE_FRAME_STYLES.container, 'animate-pulse'),
  
  // Enhanced loading states
  shimmer: 'absolute inset-0 bg-gradient-to-r from-sf-hi via-sf-hst to-sf-hi bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
  placeholder: 'absolute inset-0 flex items-center justify-center text-on-sf-var/50',
  loadingText: 'mt-2 text-sm text-on-sf-var/60',
  
  // Icon styling
  iconContainer: 'w-16 h-16 text-on-sf-var/30 mb-2',
} as const;

export const ImageFrame = memo(function ImageFrame({ 
  imageAttributes, 
  caption,
  processedCaption,
  maxWidth,
  className
}: ImageFrameProps) {
  const [dimensions, setDimensions] = useState<ImageFrameDimensions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dimensions on mount and window resize
  useEffect(() => {
    const calculateDimensions = () => {
      const newDimensions = calculateImageFrameDimensionsClient(
        imageAttributes,
        maxWidth
      );
      setDimensions(newDimensions);
      setIsLoading(false);
    };

    calculateDimensions();

    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageAttributes, maxWidth]);

  if (!dimensions || isLoading) {
    const estimatedHeight = 400;
    return (
      <ImageFrameSkeleton 
        width={maxWidth || '100%'}
        height={estimatedHeight}
        className={className}
        showShimmer={true}
      />
    );
  }

  const containerStyle: React.CSSProperties = {
    height: dimensions.height,
    maxHeight: dimensions.maxHeight,
    aspectRatio: dimensions.ratio,
    maxWidth: dimensions.width || maxWidth || '100%',
  };

  const hasCaption = Boolean(processedCaption || caption);

  return (
    <div className={IMAGE_FRAME_STYLES.wrapper}>
      <figure className={IMAGE_FRAME_STYLES.figure}>
        <div 
          className={cn(IMAGE_FRAME_STYLES.container, className)}
          style={containerStyle}
        >
          <Image
            src={imageAttributes.src}
            alt={imageAttributes.alt || 'Image'}
            width={imageAttributes.width || 1200}
            height={imageAttributes.height || 800}
            className={IMAGE_FRAME_STYLES.image}
            sizes="(max-width: 768px) 95vw, (max-width: 1024px) 90vw, 85vw"
            priority={false}
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      </figure>
      
      {/* ✅ NEW: Caption placed outside figure element for better readability */}
      {hasCaption && (
        <figcaption 
          className={IMAGE_FRAME_STYLES.caption}
          dangerouslySetInnerHTML={{ __html: processedCaption || caption || '' }}
        />
      )}
    </div>
  );
});

export default ImageFrame;