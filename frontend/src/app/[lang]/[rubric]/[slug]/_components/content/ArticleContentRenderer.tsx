// src/app/[lang]/[rubric]/[slug]/_components/content/ArticleContentRenderer.tsx

import { ContentChunk } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/markdownTypes';
import { MarkdownContent } from './MarkdownContent';
import { CustomBlockquote } from './CustomBlockquote';
import ImageFrame from '../ImageFrame';
import Table from './Table';
import InlineArticleCard from './InlineArticleCard';
import { Lang } from '@/config/i18n';

interface ArticleContentRendererProps {
  chunks: ContentChunk[];
  lang: Lang;
}

export default function ArticleContentRenderer({ 
  chunks, 
  lang 
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
          <div key={index}>
            <CustomBlockquote 
              blockquoteProps={chunk.blockquoteProps} 
              lang={lang} 
            />
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
    <>
      {chunks.map(renderChunk)}
    </>
  );
}