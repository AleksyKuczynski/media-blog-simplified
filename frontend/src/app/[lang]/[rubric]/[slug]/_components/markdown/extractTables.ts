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
 * - ./markdownToHtml (convertSimpleMarkdownToHtml)
 * 
 * @param content - Markdown string
 * @returns {chunks: ContentChunk[]} Table and text chunks
 */

import { ContentChunk, TableData } from './markdownTypes';
import { extractCaption } from './captionUtils';
import { convertSimpleMarkdownToHtml } from './markdownToHtml';

/**
 * Detects if a line is a markdown table row
 */
function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line);
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
 * Parse a table row into cells and process markdown to HTML
 */
function parseTableRow(line: string): string[] {
  // Remove leading/trailing pipes and whitespace
  const content = line.trim().replace(/^\||\|$/g, '');
  
  // Split by pipe and process each cell
  return content.split('|').map(cell => {
    const trimmed = cell.trim();
    // Convert markdown formatting to HTML (bold, italic, links, etc.)
    // Remove wrapping <p> tags that remark adds
    const html = convertSimpleMarkdownToHtml(trimmed)
      .replace(/^<p>/, '')
      .replace(/<\/p>\s*$/, '')
      .trim();
    return html;
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
              processedCaption: convertSimpleMarkdownToHtml(caption)
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