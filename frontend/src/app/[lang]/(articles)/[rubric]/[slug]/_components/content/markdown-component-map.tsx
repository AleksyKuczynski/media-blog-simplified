// app/[lang]/[rubric]/[slug]/_components/content/markdown-component-map.tsx
/**
 * Article Content - Markdown Component Mapping
 * 
 * Maps HTML element names to React components.
 * Used by MarkdownContent.tsx for rendering parsed HTML.
 * 
 * Component Categories:
 * - Typography: Headings, paragraphs, links, lists
 * - Tables: Table structure and cells
 * - Special: Spans (balloon tips), images, figures
 * 
 * Architecture:
 * - All styles referenced from article.styles.ts
 * - Helper functions separated at top
 * - Handlers grouped by category
 * - Component map at bottom
 * 
 * Dependencies:
 * - article.styles.ts (BLOCKS_STYLES, ELEMENTS_STYLES)
 * - Typography components (Heading, Paragraph, Link, List, ListItem)
 * - Special components (BalloonTip, ImageFrame)
 * 
 * @see MarkdownContent.tsx
 */

import React from 'react';
import { ArticleHeading } from './Heading';
import { ArticleLink } from './Link';
import { ArticleList } from './List';
import { ListItem } from './ListItem';
import { ArticleParagraph } from './Paragraph';
import ImageFrame from '../ImageFrame';
import { BalloonTip } from './BalloonTip';
import { BLOCKS_STYLES } from '../article.styles';

// ================================================================
// HELPER FUNCTIONS
// ================================================================

/**
 * Recursively extract text content from React children
 * Used by BalloonTip to get trigger text from nested elements
 */
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  
  if (typeof children === 'number') {
    return String(children);
  }
  
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode };
    if (props.children) {
      return extractTextFromChildren(props.children);
    }
  }
  
  return '';
};

// ================================================================
// TABLE HANDLERS
// ================================================================

/**
 * Handles tables that weren't caught by extractTables
 * Applies wrapper and scroll container from BLOCKS_STYLES.table
 */
const TableHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  return (
    <figure className={BLOCKS_STYLES.table.wrapper}>
      <div className={BLOCKS_STYLES.table.container}>
        <table className={BLOCKS_STYLES.table.table} {...props}>
          {children}
        </table>
      </div>
    </figure>
  );
};

const THeadHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className={BLOCKS_STYLES.table.header} {...props}>{children}</thead>;
};

const TBodyHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody {...props}>{children}</tbody>;
};

const TRHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  const isHeader = props.className?.includes('table-header');
  return <tr className={isHeader ? '' : BLOCKS_STYLES.table.bodyRow} {...props}>{children}</tr>;
};

const THHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <th className={BLOCKS_STYLES.table.headerCell} {...props}>{children}</th>;
};

const TDHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <td className={BLOCKS_STYLES.table.bodyCell} {...props}>{children}</td>;
};

// ================================================================
// SPECIAL HANDLERS
// ================================================================

/**
 * Handles span elements - detects balloon tip data attribute
 * and renders BalloonTip component, otherwise renders plain span
 */
const SpanHandler = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  const balloonTipUrl = (props as any)['data-balloon-tip'];
  
  if (balloonTipUrl) {
    const text = extractTextFromChildren(children);
    return <BalloonTip text={text} url={balloonTipUrl} />;
  }
  
  return <span {...props}>{children}</span>;
};

/**
 * Handles figure elements - applies styles from BLOCKS_STYLES.figure
 */
const FigureHandler = ({ children }: { children: React.ReactNode }) => {
  return <figure className={BLOCKS_STYLES.figure.container}>{children}</figure>;
};

/**
 * Handles figcaption elements - applies styles from BLOCKS_STYLES.figure
 */
const FigcaptionHandler = ({ children }: { children: React.ReactNode }) => {
  return <figcaption className={BLOCKS_STYLES.figure.caption}>{children}</figcaption>;
};

// ================================================================
// COMPONENT MAP
// ================================================================

/**
 * Maps HTML tag names to React components
 * Used by MarkdownContent to render parsed HTML
 */
export const componentMap: Record<string, React.ComponentType<any>> = {
  // Typography - Headings
  h1: (props) => <ArticleHeading level={1} {...props} />,
  h2: (props) => <ArticleHeading level={2} {...props} />,
  h3: (props) => <ArticleHeading level={3} {...props} />,
  h4: (props) => <ArticleHeading level={4} {...props} />,
  h5: (props) => <ArticleHeading level={5} {...props} />,
  h6: (props) => <ArticleHeading level={6} {...props} />,
  
  // Typography - Text Elements
  p: ArticleParagraph,
  
  // Typography - Lists
  ul: (props) => <ArticleList ordered={false} {...props} />,
  ol: (props) => <ArticleList ordered={true} {...props} />,
  li: ListItem,
  
  // Typography - Links
  a: ArticleLink,
  
  // Tables
  table: TableHandler,
  thead: THeadHandler,
  tbody: TBodyHandler,
  tr: TRHandler,
  th: THHandler,
  td: TDHandler,
  
  // Special Elements
  span: SpanHandler,
  img: ({ caption, ...props }: React.ComponentProps<typeof ImageFrame> & { caption?: string }) => 
    <ImageFrame {...props} caption={caption} />,
  figure: FigureHandler,
  figcaption: FigcaptionHandler,
};