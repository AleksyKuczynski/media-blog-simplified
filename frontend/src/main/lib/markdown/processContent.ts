// src/main/lib/markdown/processContent.ts

import { parseBlockquotes } from './parseBlockquotes';
import { parseImageFrames } from './parseImageFrames';
import { extractTables } from './extractTables';
import { generateToc } from './generateToc';
import { ProcessedContent, ContentChunk } from './markdownTypes';
import { extractImagesAndCaptions } from './extractImagesAndCaptions';
import { convertMarkdownToHtmlSync } from './markdownToHtml';
import { createAddHeadingIds } from './addHeadingIds';
import { processLinks } from './processLinks';
import { processArticleCards } from './processArticleCards';

/**
 * Main content processing pipeline
 * 
 * ✅ CORRECT ARCHITECTURE: Process article cards BEFORE HTML conversion
 * This creates clean, separate chunks for different content types
 */
export async function processContent(content: string): Promise<ProcessedContent> {
  const addHeadingIds = createAddHeadingIds();

  try {
    // Step 1: Parse custom blockquotes
    const blockquoteChunks = parseBlockquotes(content);
    let processedChunks: ContentChunk[] = [];

    for (const chunk of blockquoteChunks) {
      if (chunk.type === 'markdown' && chunk.content) {
        // Step 2: Extract images and captions
        const { chunks } = await extractImagesAndCaptions(chunk.content);
        
        // Step 3: Process image frames
        const imageFrameChunks = await parseImageFrames(chunks);
        
        // Step 4: Extract tables from markdown chunks
        let tableProcessedChunks: ContentChunk[] = [];
        for (const imgChunk of imageFrameChunks) {
          if (imgChunk.type === 'markdown' && imgChunk.content) {
            const { chunks: tableChunks } = await extractTables(imgChunk.content);
            tableProcessedChunks = [...tableProcessedChunks, ...tableChunks];
          } else {
            tableProcessedChunks.push(imgChunk);
          }
        }
        
        // Step 5: Process links (detect article slugs, external links, balloon tips)
        // Creates markdown-safe delimiters for article cards
        const linkProcessedChunks = processLinks(tableProcessedChunks);
        
        // Step 6: Process article cards (validate slugs, fetch data, create chunks)
        // ✅ RUNS BEFORE HTML CONVERSION - This is the correct order
        // Splits markdown chunks into: [markdown, article-card, markdown, ...]
        const articleCardChunks = await processArticleCards(linkProcessedChunks);
        
        // Step 7: Convert remaining markdown chunks to HTML
        // Only processes markdown chunks, leaves article-card chunks untouched
        const htmlChunks = await Promise.all(articleCardChunks.map(async (c) => {
          if (c.type === 'markdown' && c.content) {
            const htmlContent = convertMarkdownToHtmlSync(c.content);
            const contentWithIds = addHeadingIds(htmlContent);
            return { ...c, content: contentWithIds };
          }
          return c;
        }));
        
        processedChunks = [...processedChunks, ...htmlChunks];
      } else {
        processedChunks.push(chunk);
      }
    }

    // Generate table of contents (only from markdown chunks)
    const toc = generateToc(processedChunks
      .filter(chunk => chunk.type === 'markdown' && chunk.content)
      .map(chunk => chunk.content!)
      .join('\n'));

    return { chunks: processedChunks, toc };
  } catch (error) {
    console.error('Error in processContent:', error);
    return { 
      chunks: [{ type: 'markdown', content: `Error processing content: ${error instanceof Error ? error.message : String(error)}` }], 
      toc: [] 
    };
  }
}