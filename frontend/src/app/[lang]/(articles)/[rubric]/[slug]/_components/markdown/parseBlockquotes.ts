// app/[lang]/[rubric]/[slug]/_components/markdown/parseBlockquotes.ts
/**
 * Article Markdown - Blockquote Parser
 * 
 * Extracts custom blockquotes from markdown using >> delimiter.
 * First step in processing pipeline.
 * 
 * Syntax:
 * >> Blockquote content here
 * >> Can span multiple lines
 * >> Supports **markdown** formatting
 * 
 * Features:
 * - Multi-line blockquote support
 * - Preserves inline markdown formatting
 * - Separates blockquotes into distinct chunks
 * 
 * Dependencies:
 * - ./markdownTypes (ContentChunk)
 * 
 * @param content - Raw markdown string
 * @returns {ContentChunk[]} Chunks with separated blockquotes
 */

import { BlockquoteProps, ContentChunk, EpigraphBlockquote, HighlightBlockquote, ProfileBlockquote, QuoteBlockquote } from './markdownTypes';

function parseHighlight(content: string): HighlightBlockquote | null {
  const paragraphs = content.trim().split('\n');
  if (paragraphs.length === 0) return null;
  
  const highlightContent = content.trim();
  if (!highlightContent) return null;

  return {
    type: '1',
    content: highlightContent
  };
}

function parseQuote(content: string): QuoteBlockquote | null {
  const lines = content.trim().split('\n');
  const authorMatch = lines[0].match(/^## (.+)$/);
  if (!authorMatch) return null;
  
  const quoteParts = lines.slice(1).join('\n').trim();
  if (!quoteParts) return null;

  return {
    type: '2',
    author: authorMatch[1].trim(),
    content: quoteParts
  };
}

function parseEpigraph(content: string): EpigraphBlockquote | null {
  const lines = content.trim().split('\n');
  const sourceMatch = lines[0].match(/^# (.+)$/);
  const authorMatch = lines[1]?.match(/^## (.+)$/);
  
  if (!sourceMatch || !authorMatch) return null;
  
  const epigraphContent = lines.slice(2).join('\n').trim();
  if (!epigraphContent) return null;

  return {
    type: '3',
    source: sourceMatch[1].trim(),
    author: authorMatch[1].trim(),
    content: epigraphContent
  };
}

function parseProfile(content: string): ProfileBlockquote | null {
  const cleanContent = content.trim();
  if (!cleanContent) return null;

  return {
    type: '4',
    content: cleanContent
  };
}

export function parseBlockquotes(content: string): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  let currentText = '';
  
  const parts = content.split(/(:::[1-4]|:::)/);
  let isInBlockquote = false;
  let blockquoteType: '1' | '2' | '3' | '4' | null = null;
  let blockquoteContent = '';

  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.match(/^:::[1-4]$/)) {
      if (currentText) {
        chunks.push({
          type: 'markdown',
          content: currentText.trim(),
          blockquoteProps: { type: '1', content: '' },
          blockquoteType: '1'
        });
        currentText = '';
      }
      isInBlockquote = true;
      blockquoteType = trimmedPart[3] as '1' | '2' | '3' | '4';
      blockquoteContent = '';
    } else if (trimmedPart === ':::') {
      if (isInBlockquote && blockquoteType && blockquoteContent) {
        let blockquoteProps: BlockquoteProps | null = null;
        const cleanContent = blockquoteContent.trim();
        
        switch (blockquoteType) {
          case '1':
            blockquoteProps = parseHighlight(cleanContent);
            break;
          case '2':
            blockquoteProps = parseQuote(cleanContent);
            break;
          case '3':
            blockquoteProps = parseEpigraph(cleanContent);
            break;
          case '4':
            blockquoteProps = parseProfile(cleanContent);
            break;
        }
        
        if (blockquoteProps) {
          chunks.push({
            type: 'blockquote',
            content: cleanContent,
            blockquoteType,
            blockquoteProps
          });
        }
        // If parsing failed, skip this blockquote silently
      }
      isInBlockquote = false;
      blockquoteType = null;
      blockquoteContent = '';
    } else if (isInBlockquote) {
      blockquoteContent += part;
    } else {
      currentText += part;
    }
  }

  if (currentText) {
    chunks.push({
      type: 'markdown',
      content: currentText.trim(),
      blockquoteProps: { type: '1', content: '' },
      blockquoteType: '1'
    });
  }

  return chunks;
}