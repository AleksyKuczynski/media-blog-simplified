// src/main/components/Article/ImageFrame.tsx

'use client'

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/main/lib/utils/utils';
import { ImageAttributes, ImageFrameDimensions } from '@/main/lib/image-utils/imageFrameTypes';
import { calculateImageFrameDimensionsClient } from '@/main/lib/image-utils/calculateImageFrameDimensions';
import { ImageFrameSkeleton } from './ImageFrameSkeleton';
import { MEDIA_STYLES } from '../styles';

interface ImageFrameProps {
  imageAttributes: ImageAttributes;
  caption?: string;
  processedCaption?: string;
  maxWidth?: number;
  className?: string;
}

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
    <div className={MEDIA_STYLES.imageFrame.wrapper}>
      <figure className={MEDIA_STYLES.imageFrame.figure}>
        <div 
          className={cn(MEDIA_STYLES.imageFrame.container, className)}
          style={containerStyle}
        >
          <Image
            src={imageAttributes.src}
            alt={imageAttributes.alt || 'Image'}
            width={imageAttributes.width || 1200}
            height={imageAttributes.height || 800}
            className={MEDIA_STYLES.imageFrame.image}
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
          className={MEDIA_STYLES.imageFrame.caption}
          dangerouslySetInnerHTML={{ __html: processedCaption || caption || '' }}
        />
      )}
    </div>
  );
});

export default ImageFrame;