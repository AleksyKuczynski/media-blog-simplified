// src/main/lib/markdown/addHeadingIds.ts

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