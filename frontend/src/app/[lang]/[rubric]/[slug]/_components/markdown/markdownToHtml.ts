// src/main/lib/markdown/markdownToHtml.ts
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