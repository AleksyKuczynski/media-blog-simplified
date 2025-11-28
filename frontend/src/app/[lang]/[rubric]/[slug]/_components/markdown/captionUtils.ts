// src/main/lib/markdown/captionUtils.ts

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