// src/main/lib/markdown/generateToc.ts

import { TocItem } from './markdownTypes';

export function generateToc(content: string): TocItem[] {
  const headings = content.match(/<h2 id="(heading-\d+)".*?>(.*?)<\/h2>/g);
  if (!headings) return [];

  return headings.map((heading) => {
    const [, id, text] = heading.match(/<h2 id="(heading-\d+)".*?>(.*?)<\/h2>/) || [];
    return { id, text: text.replace(/<[^>]*>/g, '') };
  });
}