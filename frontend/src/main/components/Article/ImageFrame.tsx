// src/main/components/Article/ImageFrame.tsx
'use client'

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { ImageAttributes, ImageFrameDimensions } from '@/main/lib/image-utils/imageFrameTypes';
import { calculateImageFrameDimensionsClient } from '@/main/lib/image-utils/calculateImageFrameDimensions';
import { Caption, createInitialCaptionBehavior } from './Captions';

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
    // Loading skeleton with estimated dimensions
    const estimatedHeight = 400;
    return (
      <div 
        className={`
          relative mx-auto mb-8 bg-sf-cont animate-pulse
          rounded-2xl ${className || ''}
        `}
        style={{ 
          height: estimatedHeight,
          maxWidth: maxWidth || '100%'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-on-sf-var/50">
          Loading image...
        </div>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = {
    height: dimensions.height,
    maxHeight: dimensions.maxHeight,
    aspectRatio: dimensions.ratio,
    maxWidth: dimensions.width || maxWidth || '100%',
  };

  const hasCaption = Boolean(processedCaption || caption);
  const captionBehavior = createInitialCaptionBehavior(hasCaption);

  return (
    <figure className="w-full">
      <div 
        className={`
          relative mx-auto mb-8 overflow-hidden bg-sf-cont
          rounded-2xl shadow-lg
          ${className || ''}
        `}
        style={containerStyle}
      >
        <Image
          src={imageAttributes.src}
          alt={imageAttributes.alt || 'Image'}
          width={imageAttributes.width || 1200}
          height={imageAttributes.height || 800}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 95vw, (max-width: 1024px) 90vw, 85vw"
          priority={false}
          quality={90}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {hasCaption && (
          <Caption
            content={processedCaption || caption || ''}
            behavior={captionBehavior}
            visible={true}
            onModeChange={() => {}} // No-op for single images
            navigationLayout="horizontal"
            isActive={true}
            imageHeight={dimensions.height}
          />
        )}
      </div>
    </figure>
  );
});

export default ImageFrame;