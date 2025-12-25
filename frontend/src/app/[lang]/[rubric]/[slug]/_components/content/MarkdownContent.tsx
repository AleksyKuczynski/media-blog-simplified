// app/[lang]/[rubric]/[slug]/_components/content/MarkdownContent.tsx
/**
 * Article Content - Markdown HTML Renderer
 * 
 * Parses HTML string from markdown conversion and renders
 * appropriate React components based on element types.
 * Uses node-html-parser for DOM traversal.
 * 
 * Process:
 * 1. Parse HTML string to DOM tree
 * 2. Traverse nodes recursively
 * 3. Map HTML tags to React components via componentMap
 * 4. Render component tree
 * 
 * Dependencies:
 * - markdown-component-map.ts (element to component mapping)
 * - Heading.tsx, Paragraph.tsx, Link.tsx, List.tsx, ListItem.tsx
 * 
 * @param content - HTML string from markdown conversion
 */
'use client';

import React from 'react';
import { parse, HTMLElement, Node, NodeType } from 'node-html-parser';
import { componentMap } from './markdown-component-map';

// Void elements that must not have children
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export const MarkdownContent: React.FC<{ content: string }> = ({ content }) => {
  const root = parse(content);
  
  const renderNode = (node: Node): React.ReactNode => {
    if (node.nodeType === NodeType.TEXT_NODE) {
      // For whitespace-only text nodes in table contexts, skip them
      const text = node.text;
      if (!text || text.trim() === '') return null;
      return text;
    }
    
    if (node.nodeType === NodeType.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      
      const Component = componentMap[tagName] || tagName;

      const props: any = {};
      Object.entries(element.attributes).forEach(([key, value]) => {
        // Convert 'class' to 'className' for React
        if (key === 'class') {
          props.className = value;
        } 
        // Keep data-* attributes as-is (React supports them)
        else if (key.startsWith('data-')) {
          props[key] = value;
        }
        // Convert other hyphenated attributes to camelCase
        else {
          props[key] = value;
        }
      });

      // Handle void elements - must not have children
      if (VOID_ELEMENTS.has(tagName)) {
        return <Component {...props} />;
      }

      const children = element.childNodes.map((child, index) => 
        <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
      );

      return <Component {...props}>{children}</Component>;
    }
    return null;
  };

  return <>{root.childNodes.map((child, index) => 
    <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
  )}</>;
};