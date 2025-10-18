// src/main/components/Article/ImageFrameSkeleton.tsx

import React from 'react';
import { cn } from '@/main/lib/utils/utils';
// Import from ImageFrame where styling logic lives
import { IMAGE_FRAME_SKELETON_STYLES } from './ImageFrame';

interface ImageFrameSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  showShimmer?: boolean;
  showIcon?: boolean;
}

export function ImageFrameSkeleton({ 
  width = '100%',
  height = 400,
  className,
  showShimmer = true,
  showIcon = true
}: ImageFrameSkeletonProps) {
  return (
    <figure className={IMAGE_FRAME_SKELETON_STYLES.figure}>
      <div 
        className={cn(IMAGE_FRAME_SKELETON_STYLES.container, className)}
        style={{ width, height }}
        role="status"
        aria-label="Loading image..."
      >
        {/* Shimmer effect overlay */}
        {showShimmer && (
          <div className={IMAGE_FRAME_SKELETON_STYLES.shimmer} />
        )}
        
        {/* Centered placeholder content */}
        <div className={IMAGE_FRAME_SKELETON_STYLES.placeholder}>
          <div className="flex flex-col items-center">
            {showIcon && (
              <svg 
                className={IMAGE_FRAME_SKELETON_STYLES.iconContainer}
                fill="currentColor" 
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                  clipRule="evenodd" 
                />
              </svg>
            )}
            <div className={IMAGE_FRAME_SKELETON_STYLES.loadingText}>
              Loading image...
            </div>
          </div>
        </div>
        
        <span className="sr-only">Loading image...</span>
      </div>
    </figure>
  );
}