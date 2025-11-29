// app/[lang]/[rubric]/[slug]/_components/content/ImageFrame.tsx
/**
 * Article Content - Image Frame Component
 * 
 * Responsive image container with caption support.
 * Replaces legacy carousel for single image display.
 * 
 * Features:
 * - Next.js Image optimization
 * - Directus asset integration
 * - Responsive sizing (responsive by default)
 * - Optional caption with HTML formatting
 * - Fixed aspect ratio maintenance
 * 
 * Image Attributes:
 * - src: Full Directus asset URL
 * - alt: Image alt text (from Directus or markdown)
 * - width/height: Asset dimensions from Directus
 * - title: Optional title from Directus metadata
 * 
 * Caption Handling:
 * - HTML content support (bold, italic, links)
 * - External links preserved
 * - Article slugs removed (captions stay simple)
 * 
 * Dependencies:
 * - ../article.styles (MEDIA_STYLES.imageFrame)
 * - Next.js Image component
 * - ./markdownTypes (ImageAttributes)
 * 
 * @param imageAttributes - Image metadata from parseImageFrames
 * @param caption - Optional HTML caption string
 */

'use client'

import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { MEDIA_STYLES } from './article.styles';

export interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  filename?: string;
}

interface ImageFrameProps {
  imageAttributes: ImageAttributes;
  caption?: string;
  processedCaption?: string;
  maxWidth?: number;
  className?: string;
}

const styles = MEDIA_STYLES.imageFrame;

export const ImageFrame = memo(function ImageFrame({ 
  imageAttributes, 
  caption,
  processedCaption,
  maxWidth,
  className
}: ImageFrameProps) {
  const hasCaption = Boolean(processedCaption || caption);

  return (
    <div className={styles.wrapper}>
      <figure className={styles.figure}>
        <div 
          className={cn(styles.container, className)}
          style={{
            maxWidth: maxWidth || '100%'
          }}
        >
          <Image
            src={imageAttributes.src}
            alt={imageAttributes.alt || 'Image'}
            width={imageAttributes.width || 1200}
            height={imageAttributes.height || 800}
            className={styles.image}
            sizes="(max-width: 768px) 95vw, (max-width: 1024px) 90vw, 85vw"
            priority={false}
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      </figure>
      
      {hasCaption && (
        <figcaption 
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: processedCaption || caption || '' }}
        />
      )}
    </div>
  );
});

export default ImageFrame;