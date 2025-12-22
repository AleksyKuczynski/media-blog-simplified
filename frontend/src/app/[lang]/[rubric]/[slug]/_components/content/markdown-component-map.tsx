// app/[lang]/[rubric]/[slug]/_components/content/markdown-component-map.ts
/**
 * Article Content - Markdown Component Mapping
 * 
 * Maps HTML element names to React components.
 * Used by MarkdownContent.tsx for rendering parsed HTML.
 * 
 * Mappings:
 * - h1-h6 → Heading
 * - p → Paragraph  
 * - a → Link
 * - ul, ol → List
 * - li → ListItem
 * 
 * NOTE: Does not handle custom blocks (blockquote, image-frame, table)
 * which are processed separately by Content.tsx
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

// Handles tables that weren't caught by extractTables
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
  // Detect if this is in thead or tbody based on parent
  const isHeader = props.className?.includes('table-header');
  return <tr className={isHeader ? '' : BLOCKS_STYLES.table.bodyRow} {...props}>{children}</tr>;
};

const THHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <th className={BLOCKS_STYLES.table.headerCell} {...props}>{children}</th>;
};

const TDHandler = ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
  return <td className={BLOCKS_STYLES.table.bodyCell} {...props}>{children}</td>;
};

// Helper to recursively extract text from React children
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

// Span handler for balloon tips and regular spans
const SpanHandler = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  const balloonTipUrl = (props as any)['data-balloon-tip'];
  
  if (balloonTipUrl) {
    const text = extractTextFromChildren(children);
    return <BalloonTip text={text} url={balloonTipUrl} />;
  }
  
  return <span {...props}>{children}</span>;
};

export const componentMap: Record<string, React.ComponentType<any>> = {
  h1: (props) => <ArticleHeading level={1} {...props} />,
  h2: (props) => <ArticleHeading level={2} {...props} />,
  h3: (props) => <ArticleHeading level={3} {...props} />,
  h4: (props) => <ArticleHeading level={4} {...props} />,
  h5: (props) => <ArticleHeading level={5} {...props} />,
  h6: (props) => <ArticleHeading level={6} {...props} />,
  p: ArticleParagraph,
  ul: (props) => <ArticleList ordered={false} {...props} />,
  ol: (props) => <ArticleList ordered={true} {...props} />,
  li: ListItem,
  a: ArticleLink,
  span: SpanHandler,
  img: ({ caption, ...props }: React.ComponentProps<typeof ImageFrame> & { caption?: string }) => 
    <ImageFrame {...props} caption={caption} />,
  figure: ({ children }: { children: React.ReactNode }) => <figure className="my-4">{children}</figure>,
  figcaption: ({ children }: { children: React.ReactNode }) => 
    <figcaption className="text-center text-sm mt-2 text-gray-600">{children}</figcaption>,
  table: TableHandler,
  thead: THeadHandler,
  tbody: TBodyHandler,
  tr: TRHandler,
  th: THHandler,
  td: TDHandler,
};