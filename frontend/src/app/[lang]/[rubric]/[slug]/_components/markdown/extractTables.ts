// app/[lang]/[rubric]/[slug]/_components/markdown/extractTables.ts
/**
 * Article Markdown - Table Extractor
 * 
 * Extracts and parses markdown tables with alignment support.
 * 
 * Markdown Table Format:
 * | Header 1 | Header 2 |
 * |:---------|:--------:|  (alignment: left, center)
 * | Cell 1   | Cell 2   |
 * 
 * Features:
 * - Header/body separation
 * - Column alignment detection (left, center, right)
 * - Inline markdown in cells (bold, italic, links)
 * - HTML entity escaping
 * 
 * Alignment Syntax:
 * - :-----  = left
 * - :-----: = center
 * - -----:  = right
 * - -----   = none
 * 
 * Dependencies:
 * - ./markdownTypes (ContentChunk, TableData)
 * - ./captionUtils (extractCaption)
 * 
 * @param content - Markdown string
 * @returns {chunks: ContentChunk[]} Table and text chunks
 */

import { ContentChunk, TableData } from './markdownTypes';
import { extractCaption } from './captionUtils';

/**
 * Detects if a line is a markdown table row
 * Must have pipes with actual content between them
 */
function isTableRow(line: string): boolean {
  const trimmed = line.trim();
  // Must start and end with pipe
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return false;
  
  // Remove outer pipes and check if there's content
  const content = trimmed.slice(1, -1).trim();
  
  // Reject standalone pipe separators like just "|"
  if (content === '') return false;
  
  // Must contain at least one pipe separator between cells
  return content.includes('|');
}

/**
 * Detects if a line is a table separator (alignment row)
 */
function isTableSeparator(line: string): boolean {
  return /^\s*\|[\s\-:]+\|\s*$/.test(line);
}

/**
 * Parse alignment from separator row
 * Examples: 
 * - "------" -> 'none'
 * - ":-----" -> 'left'
 * - ":-----:" -> 'center'
 * - "-----:" -> 'right'
 */
function parseAlignment(cell: string): 'left' | 'center' | 'right' | 'none' {
  const trimmed = cell.trim();
  const hasLeft = trimmed.startsWith(':');
  const hasRight = trimmed.endsWith(':');
  
  if (hasLeft && hasRight) return 'center';
  if (hasLeft) return 'left';
  if (hasRight) return 'right';
  return 'none';
}

/**
 * Convert inline markdown to HTML without block-level processing
 * Handles: bold, italic, links, inline code, line breaks
 * Avoids remark's <p> wrapper and nested structure issues
 */
function convertInlineMarkdownToHtml(text: string): string {
  // HTML escape first
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Convert <br> markdown (two spaces or explicit <br>)
  html = html.replace(/  \n/g, '<br>')
    .replace(/&lt;br&gt;/g, '<br>');

  // Convert inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Convert bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Convert italic: *text* or _text_ (but not if surrounded by word characters)
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\b_([^_]+)_\b/g, '<em>$1</em>');

  // Convert links: [text](url)
  // Must unescape the parts that were escaped earlier
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    const unescapedUrl = url
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
    return `<a href="${unescapedUrl}">${text}</a>`;
  });

  return html.trim();
}

/**
 * Split table row by pipes, respecting markdown link syntax
 * Handles cases like: [text](url) | [other](url)
 */
function splitTableCells(content: string): string[] {
  const cells: string[] = [];
  let currentCell = '';
  let inLink = false;
  let inLinkUrl = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : '';
    
    // Track if we're inside a markdown link
    if (char === '[' && prevChar !== '\\') {
      inLink = true;
      currentCell += char;
    } else if (char === ']' && prevChar !== '\\' && inLink) {
      inLink = false;
      currentCell += char;
      // Check if URL part follows
      if (i + 1 < content.length && content[i + 1] === '(') {
        inLinkUrl = true;
      }
    } else if (char === '(' && prevChar === ']') {
      inLinkUrl = true;
      currentCell += char;
    } else if (char === ')' && prevChar !== '\\' && inLinkUrl) {
      inLinkUrl = false;
      currentCell += char;
    } else if (char === '|' && !inLink && !inLinkUrl) {
      // This is a cell separator
      cells.push(currentCell);
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  // Add the last cell
  if (currentCell || cells.length > 0) {
    cells.push(currentCell);
  }
  
  return cells;
}

/**
 * Parse a table row into cells and process inline markdown to HTML
 */
function parseTableRow(line: string): string[] {
  // Remove leading/trailing pipes and whitespace
  const content = line.trim().replace(/^\||\|$/g, '');
  
  // Split by pipe respecting markdown link syntax
  return splitTableCells(content).map(cell => {
    const trimmed = cell.trim();
    return convertInlineMarkdownToHtml(trimmed);
  });
}

/**
 * Parse a complete markdown table
 */
function parseTable(lines: string[], startIndex: number): {
  tableData: TableData;
  endIndex: number;
} | null {
  // Need at least 3 lines: header, separator, and one data row
  if (startIndex + 2 >= lines.length) return null;
  
  const headerLine = lines[startIndex];
  const separatorLine = lines[startIndex + 1];
  
  // Verify we have header and separator
  if (!isTableRow(headerLine) || !isTableSeparator(separatorLine)) {
    return null;
  }
  
  // Parse header
  const headers = parseTableRow(headerLine);
  
  // Parse alignments (before HTML conversion)
  const alignmentCells = separatorLine.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const alignments = alignmentCells.map(parseAlignment);
  
  // Verify column count matches
  if (alignments.length !== headers.length) {
    console.warn('Table header and alignment column count mismatch');
    return null;
  }
  
  // Parse data rows
  const rows: string[][] = [];
  let currentIndex = startIndex + 2;
  
  while (currentIndex < lines.length && isTableRow(lines[currentIndex])) {
    const cells = parseTableRow(lines[currentIndex]);
    
    // Pad or truncate to match header count
    while (cells.length < headers.length) {
      cells.push('');
    }
    if (cells.length > headers.length) {
      cells.length = headers.length;
    }
    
    rows.push(cells);
    currentIndex++;
  }
  
  return {
    tableData: {
      headers,
      alignments,
      rows
    },
    endIndex: currentIndex - 1
  };
}

/**
 * Extract tables from markdown content
 * Similar to extractImagesAndCaptions pattern
 */
export async function extractTables(content: string): Promise<{
  chunks: ContentChunk[];
  remainingContent: string;
}> {
  const chunks: ContentChunk[] = [];
  const lines = content.split('\n');
  let currentMarkdown = '';
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Check if this line starts a table
    if (isTableRow(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      // Save any accumulated markdown
      if (currentMarkdown.trim()) {
        chunks.push({
          type: 'markdown',
          content: currentMarkdown.trim()
        });
        currentMarkdown = '';
      }
      
      // Parse the table
      const result = parseTable(lines, i);
      
      if (result) {
        const { tableData, endIndex } = result;
        
        // Check for caption after table (similar to image captions)
        const { caption, endIndex: captionEndIndex } = extractCaption(lines, endIndex + 1);
        
        if (caption) {
          chunks.push({
            type: 'table',
            tableData: {
              ...tableData,
              caption,
              processedCaption: convertInlineMarkdownToHtml(caption)
            }
          });
          i = captionEndIndex + 1;
        } else {
          chunks.push({
            type: 'table',
            tableData
          });
          i = endIndex + 1;
        }
      } else {
        // Failed to parse table, treat as regular markdown
        currentMarkdown += line + '\n';
        i++;
      }
    } else {
      currentMarkdown += line + '\n';
      i++;
    }
  }
  
  // Add any remaining markdown
  if (currentMarkdown.trim()) {
    chunks.push({
      type: 'markdown',
      content: currentMarkdown.trim()
    });
  }
  
  return {
    chunks,
    remainingContent: ''
  };
}