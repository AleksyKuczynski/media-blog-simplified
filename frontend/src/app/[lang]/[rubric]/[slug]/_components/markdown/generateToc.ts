// app/[lang]/[rubric]/[slug]/_components/markdown/generateToc.ts
/**
 * Article Markdown - TOC Generator
 * 
 * Generates table of contents from heading elements.
 * Extracts h2, h3, h4 headings with IDs.
 * 
 * TOC Structure:
 * - text: Heading text content
 * - id: Anchor link ID
 * - level: Heading level (2-4)
 * 
 * Features:
 * - Hierarchical structure (h2 → h3 → h4)
 * - Text extraction from HTML
 * - ID extraction for linking
 * 
 * Dependencies:
 * - node-html-parser (HTML parsing)
 * - ./markdownTypes (TOCItem)
 * 
 * @param content - HTML string with heading IDs
 * @returns {TOCItem[]} TOC items array
 */

import { TocItem } from './markdownTypes';

export function generateToc(content: string): TocItem[] {
  const headings = content.match(/<h2 id="(heading-\d+)".*?>(.*?)<\/h2>/g);
  if (!headings) return [];

  return headings.map((heading) => {
    const [, id, text] = heading.match(/<h2 id="(heading-\d+)".*?>(.*?)<\/h2>/) || [];
    return { id, text: text.replace(/<[^>]*>/g, '') };
  });
}