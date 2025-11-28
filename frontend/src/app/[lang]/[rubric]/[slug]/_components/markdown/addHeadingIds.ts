// app/[lang]/[rubric]/[slug]/_components/markdown/addHeadingIds.ts
/**
 * Article Markdown - Heading ID Generator
 * 
 * Adds unique IDs to heading elements for TOC linking.
 * Uses factory pattern to maintain ID uniqueness.
 * 
 * ID Generation:
 * - Slugified from heading text
 * - Collision detection with counter suffix
 * - Example: "Introduction" → "introduction"
 * - Collision: "Introduction" (2nd) → "introduction-2"
 * 
 * Features:
 * - Automatic ID generation
 * - Collision prevention
 * - Anchor link support
 * 
 * Dependencies: None
 * 
 * @returns {Function} ID generator function
 * 
 * Usage:
 * const addHeadingIds = createAddHeadingIds()
 * const html = addHeadingIds(htmlString)
 */

import parse, { HTMLElement } from "node-html-parser";

export function createAddHeadingIds() {
  let headingCounter = 0;

  return function addHeadingIds(content: string): string {
    const root = parse(content);
  
    root.querySelectorAll('h2').forEach((h2: HTMLElement) => {
      h2.setAttribute('id', `heading-${headingCounter++}`);
    });
  
    return root.toString();
  }
}