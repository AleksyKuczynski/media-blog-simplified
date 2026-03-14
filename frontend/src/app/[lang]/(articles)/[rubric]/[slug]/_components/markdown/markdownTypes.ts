// app/[lang]/[rubric]/[slug]/_components/markdown/markdownTypes.ts
/**
 * Article Markdown - Type Definitions
 * 
 * TypeScript interfaces for markdown processing pipeline.
 * 
 * Core Types:
 * - ContentChunk: Base chunk type
 * - ProcessedContent: Pipeline output
 * - ImageAttributes: Image metadata
 * - TableData: Table structure
 * - TOCItem: Table of contents item
 * - ArticleCardData: Embedded article data
 * 
 * Chunk Types:
 * - markdown: Standard HTML content
 * - blockquote: Custom blockquotes
 * - image: Single images
 * - figure: Images with captions
 * - image-frame: Processed images with metadata
 * - table: Markdown tables
 * - article-card: Embedded article cards
 * 
 * Dependencies: None (pure types)
 */

export interface ContentChunk {
  type: 'markdown' | 'blockquote' | 'figure' | 'image' | 'image-frame' | 'image-group' | 'table' | 'article-card';
  content?: string;
  blockquoteType?: '1' | '2' | '3' | '4';
  blockquoteProps?: BlockquoteProps;
  caption?: string;
  processedCaption?: string;
  // Single image frame properties
  imageAttributes?: ImageAttributes;
  // Image group properties (for future enhancement)
  images?: ImageFrameItem[];
  // Table properties
  tableData?: TableData;
  // Article card properties
  articleCardData?: ArticleCardData;
}

// NEW: Article card data interface
export interface ArticleCardData {
  slug: string;
  title: string;
  description?: string;
  imageSrc?: string;
  rubricSlug: string;
  publishedAt: string;
  layout: string;
}

export interface TocItem {
  id: string;
  text: string;
}

export interface ProcessedContent {
  chunks: ContentChunk[];
  toc: TocItem[];
}

export interface ImageAttributes {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  title?: string;
  filename?: string;
}

// Simplified image frame item for individual images
export interface ImageFrameItem {
  imageAttributes: ImageAttributes;
  caption?: string;
  processedCaption?: string;
}

// Legacy carousel item interface - kept for migration compatibility
// TODO: Remove once migration is complete
export interface CarouselItem {
  type: 'image' | 'figure';
  imageAttributes: ImageAttributes;
  caption?: string;
  processedCaption: string;
}


// Table interface for sheet/table support
export interface TableData {
  headers: string[];
  alignments: ('left' | 'center' | 'right' | 'none')[];
  rows: string[][];
  caption?: string;
  processedCaption?: string;
}

// Blockquote interfaces (unchanged)
export interface BlockquoteBase {
  type: '1' | '2' | '3' | '4';
  content: string;
}

export interface HighlightBlockquote extends BlockquoteBase {
  type: '1';
}

export interface QuoteBlockquote extends BlockquoteBase {
  type: '2';
  author: string;
}

export interface EpigraphBlockquote extends BlockquoteBase {
  type: '3';
  source?: string;
  author: string;
}

export interface ProfileBlockquote extends BlockquoteBase {
  type: '4';
  content: string;
}

export type BlockquoteProps = 
  | HighlightBlockquote 
  | QuoteBlockquote 
  | EpigraphBlockquote 
  | ProfileBlockquote;