// app/[lang]/[rubric]/[slug]/_components/markdown/captionUtils.ts
/**
 * Article Markdown - Caption Utilities
 * 
 * Helper functions for extracting and processing captions.
 * 
 * Functions:
 * - extractCaption: Extract caption text from following lines
 * - processCaption: Clean and format caption text
 * 
 * Caption Detection:
 * - Text immediately following image/table
 * - Stops at empty line or next block element
 * - Preserves inline markdown
 * 
 * Dependencies:
 * - ./markdownToHtml (HTML conversion)
 * 
 * @param lines - Markdown lines array
 * @param startIndex - Start position
 * @returns {string | null} Caption text or null
 */

export function extractCaption(lines: string[], startIndex: number): { caption: string | null, endIndex: number } {
  if (startIndex >= lines.length) {
    return { caption: null, endIndex: startIndex };
  }

  const nextLine = lines[startIndex].trim();

  if (!nextLine.startsWith('[')) {
    return { caption: null, endIndex: startIndex };
  }

  let caption = '';
  let bracketCount = 0;
  let endIndex = startIndex;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();

    for (let j = 0; j < line.length; j++) {
      if (line[j] === '[') bracketCount++;
      if (line[j] === ']') bracketCount--;

      caption += line[j];

      if (bracketCount === 0) {
        return { caption: caption.slice(1, -1), endIndex: i };
      }
    }

    caption += '\n';
    endIndex = i;

    if (line.startsWith('#') || line.startsWith('- ') || line.startsWith('1. ') || line.startsWith('![')) {
      return { caption: null, endIndex: startIndex };
    }
  }

  return { caption: null, endIndex: startIndex };
}