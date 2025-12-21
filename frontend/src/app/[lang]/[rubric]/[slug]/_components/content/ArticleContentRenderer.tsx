// src/app/[lang]/[rubric]/[slug]/_components/content/ArticleContentRenderer.tsx

import { ContentChunk } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/markdownTypes';
import { LAYOUT_STYLES } from '../article.styles';
import { MarkdownContent } from './MarkdownContent';
import { CustomBlockquote } from './CustomBlockquote';
import ImageFrame from '../ImageFrame';
import Table from './Table';
import InlineArticleCard from './InlineArticleCard';

interface ArticleContentRendererProps {
  chunks: ContentChunk[];
}

export default function ArticleContentRenderer({ chunks }: ArticleContentRendererProps) {
  
  const renderChunk = (chunk: ContentChunk, index: number) => {
    switch (chunk.type) {
      case 'markdown':
        return (
          <div key={index}>
            <MarkdownContent content={chunk.content || ''} />
          </div>
        );

      case 'blockquote':
        return chunk.blockquoteProps ? (
          <div key={index} className="not-prose">
            <CustomBlockquote {...chunk.blockquoteProps} />
          </div>
        ) : null;

      case 'image-frame':
        return (
          <ImageFrame
            key={index}
            imageAttributes={chunk.imageAttributes!}
            caption={chunk.caption}
            processedCaption={chunk.processedCaption}
          />
        );

      case 'image-group':
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
    <article 
      className={LAYOUT_STYLES.content.container} 
      itemProp="articleBody"
    >
      {chunks.map(renderChunk)}
    </article>
  );
}