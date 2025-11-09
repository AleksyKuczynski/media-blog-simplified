// src/main/components/Article/ArticleContentRenderer.tsx

import React from 'react';
import { ContentChunk } from '@/main/lib/markdown/markdownTypes';
import ImageFrame from './ImageFrame';
import { CustomBlockquote } from './Blockquote/CustomBlockquote';
import InlineArticleCard from './InlineArticleCard';

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
        return chunk.blockquoteProps ? (
          // Blockquotes escape prose styling for proper theme control
          <div key={index} className="not-prose">
            <CustomBlockquote {...chunk.blockquoteProps} />
          </div>
        ) : null;

      case 'image-frame':
        // Render individual image frames
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
        // Simple image group layout
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

      case 'article-card':
        // NEW: Render inline article cards
        return chunk.articleCardData ? (
          <InlineArticleCard
            key={index}
            articleCardData={chunk.articleCardData}
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