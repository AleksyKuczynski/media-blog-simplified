// src/main/components/Article/elements/componentMap.tsx
/**
 * Component map for rendering HTML elements as React components
 * 
 * ✅ UPDATED: Added span handler for balloon tips
 */

import React from 'react';
import { ArticleHeading } from './Heading';
import { ArticleLink } from './Link';
import { ArticleList } from './List';
import { ListItem } from './ListItem';
import { ArticleParagraph } from './Paragraph';
import { BalloonTip } from '../blocks/BalloonTip/BalloonTip';
import { ImageFrame } from '../media';

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
  // Check if this is a balloon tip span
  const balloonTipUrl = (props as any)['data-balloon-tip'];
  
  if (balloonTipUrl) {
    // Extract text content from children (handles nested elements)
    const text = extractTextFromChildren(children);
    
    return <BalloonTip text={text} url={balloonTipUrl} />;
  }
  
  // Regular span - preserve all attributes
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
  span: SpanHandler, // ✅ NEW: Handle balloon tip spans
  img: ({ caption, ...props }: React.ComponentProps<typeof ImageFrame> & { caption?: string }) => 
    <ImageFrame {...props} caption={caption} />,
  figure: ({ children }: { children: React.ReactNode }) => <figure className="my-4">{children}</figure>,
  figcaption: ({ children }: { children: React.ReactNode }) => 
    <figcaption className="text-center text-sm mt-2 text-gray-600">{children}</figcaption>,
};