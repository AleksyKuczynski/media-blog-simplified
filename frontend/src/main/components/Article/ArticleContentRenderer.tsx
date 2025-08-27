// src/main/components/Article/ArticleContentRenderer.tsx

import React from 'react';
import { ContentChunk } from '@/main/lib/markdown/markdownTypes';
import ImageFrame from './ImageFrame';
import ImageCarousel from './Carousel/ImageCarousel'; // ← TO BE REMOVED after migration
import { Blockquote } from './Blockquote';

interface ArticleContentRendererProps {
  chunks: ContentChunk[];
  className?: string;
}

export default function ArticleContentRenderer({ 
  chunks, 
  className 
}: ArticleContentRendererProps) {
  
  const renderChunk = (chunk: ContentChunk, index: number) => {
    switch (chunk.type) {
      case 'markdown':
        return (
          <div 
            key={index}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: chunk.content || '' }}
          />
        );

      case 'blockquote':
        return (
          <Blockquote
            key={index}
            blockquoteProps={chunk.blockquoteProps}
          />
        );

      case 'image-frame':
        // ← NEW: Render individual image frames
        return (
          <ImageFrame
            key={index}
            imageAttributes={chunk.imageAttributes!}
            caption={chunk.caption}
            processedCaption={chunk.processedCaption}
            className="my-8"
          />
        );

      case 'image-group':
        // ← FUTURE: Simple image group layout
        return (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            {chunk.images?.map((image, imgIndex) => (
              <ImageFrame
                key={imgIndex}
                imageAttributes={image.imageAttributes}
                caption={image.caption}
                processedCaption={image.processedCaption}
                className="mb-4"
              />
            ))}
          </div>
        );

      case 'carousel':
        // ← LEGACY: Keep for backward compatibility during migration
        // TODO: Remove once all content is migrated to image-frame
        console.warn('Legacy carousel detected - should be migrated to image-frame');
        return chunk.images && chunk.imageSetAnalysis && chunk.dimensions ? (
          <ImageCarousel
            key={index}
            images={chunk.images}
            dimensions={chunk.dimensions}
            initialAnalysis={chunk.imageSetAnalysis}
          />
        ) : null;

      default:
        console.warn('Unknown chunk type:', chunk.type);
        return null;
    }
  };

  return (
    <div className={className}>
      {chunks.map(renderChunk)}
    </div>
  );
}