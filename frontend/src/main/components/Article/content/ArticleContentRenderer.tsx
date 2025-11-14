// src/main/components/Article/ArticleContentRenderer.tsx

import { ContentChunk } from '@/main/lib/markdown/markdownTypes';
import { CustomBlockquote } from '../blocks/Blockquote/CustomBlockquote';
import InlineArticleCard from '../blocks/InlineArticleCard/InlineArticleCard';
import { MarkdownContent } from './MarkdownContent';
import Table from '../blocks/Table/Table';
import { ImageFrame } from '../media';

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
        // This parses HTML and converts it to React components via componentMap
        // Enables custom Tailwind classes in ArticleParagraph and other components
        return (
          <div key={index}>
            <MarkdownContent content={chunk.content || ''} />
          </div>
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
        // Render inline article cards
        return chunk.articleCardData ? (
          <InlineArticleCard
            key={index}
            articleCardData={chunk.articleCardData}
          />
        ) : null;

      case 'table':
        return chunk.tableData ? (
          <Table
            key={index}
            tableData={chunk.tableData}
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