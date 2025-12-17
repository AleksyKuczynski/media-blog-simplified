// app/[lang]/[rubric]/[slug]/_components/Content.tsx
/**
 * Article Page - Content Renderer
 * 
 * Orchestrates markdown content display with custom blocks.
 * Processes content chunks from markdown pipeline and renders
 * appropriate components for each chunk type.
 * 
 * Chunk Types:
 * - markdown: Standard HTML content
 * - blockquote: Custom blockquote blocks
 * - image-frame: Optimized images with captions
 * - table: Markdown tables with alignment
 * - article-card: Embedded article cards
 * 
 * Dependencies:
 * - article.styles.ts (LAYOUT_STYLES.content)
 * - content/* (MarkdownContent, CustomBlockquote, etc.)
 * - markdown/* (ContentChunk types)
 * 
 * @param chunks - Processed content chunks from processContent()
 * @param toc - Table of contents items
 * @param title - Article title for embedded cards
 * @param author - Author name for embedded cards
 */

import { LAYOUT_STYLES } from './article.styles';
import ArticleContentRenderer from './content/ArticleContentRenderer';
import { ContentChunk, TocItem } from './markdown/markdownTypes';

interface ContentProps {
  chunks: ContentChunk[];
  title?: string;
  author?: string;
  datePublished?: string;
}

export function Content({ chunks, title, author, datePublished }: ContentProps) {
  const structuredData = title && author && datePublished ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
  } : null;

  return (
    <article className={LAYOUT_STYLES.content.container}>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      <ArticleContentRenderer chunks={chunks} />
    </article>
  );
}