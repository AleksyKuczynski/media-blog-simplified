// src/main/components/Article/MarkdownContent.tsx
import React from 'react';
import { parse, HTMLElement, Node, NodeType } from 'node-html-parser';
import { componentMap } from '../elements';

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
        props[key === 'class' ? 'className' : key] = value;
      });

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