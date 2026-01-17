// app/[lang]/[rubric]/[slug]/_components/markdown/markdownToHtml.ts
/**
 * Article Markdown - HTML Converter
 * 
 * Converts markdown to HTML using remark.
 * Two variants: simple (captions) and full (content).
 * 
 * Functions:
 * - convertSimpleMarkdownToHtml: Limited tags (em, strong, a)
 * - convertMarkdownToHtmlSync: Full markdown support + GFM
 * 
 * Features:
 * - GitHub Flavored Markdown (GFM) support
 * - HTML sanitization for simple variant
 * - Synchronous processing
 * 
 * Dependencies:
 * - remark (markdown parser)
 * - remark-html (HTML generator)
 * - remark-gfm (GitHub Flavored Markdown)
 * 
 * @param markdown - Markdown string
 * @returns {string} HTML string
 */

import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const simpleHtmlOptions = {
  sanitize: true,
  allowedTags: ['em', 'strong', 'a'],
  allowedAttributes: {
    'a': ['href']
  }
};

export function convertSimpleMarkdownToHtml(markdown: string): string {
  return remark()
    .use(html, simpleHtmlOptions)
    .processSync(markdown)
    .toString();
}

export function convertMarkdownToHtmlSync(markdown: string): string {
  return remark()
    .use(html, { sanitize: false })
    .use(remarkGfm)
    .processSync(markdown)
    .toString();
}